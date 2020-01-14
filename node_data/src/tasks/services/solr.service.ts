import { Injectable, Logger } from '@nestjs/common';
import { redisOptions } from 'src/config/redis.config';
import solr = require('solr-client');
import config = require('config');
import redis = require('redis');
import cron = require('cron');

const REDIS_SET_NAME = 'SolrWorker';

@Injectable()
export class SolrService {
    private readonly logger = new Logger('SolrService');
    private readonly redisClient = redis.createClient(redisOptions);

    private readonly cronSolrWorker = async () => {
        const elementCount: number = await new Promise((resolve, reject) => {
            this.redisClient.scard(REDIS_SET_NAME, (err, value) => {
                if (err) {
                    this.logger.error(err);
                    reject(err);
                }
                resolve(value);
            });
        });

        if (elementCount > 0) {
            const elements: string[] = await new Promise((resolve, reject) => {
                this.redisClient.spop(REDIS_SET_NAME, elementCount, (err, values) => {
                    if (err) {
                        this.logger.error(err);
                        reject(err);
                    }
                    resolve(values);
                });
            });
            this.addTasks(elements.map(el => JSON.parse(el)));
        }
    }

    onModuleInit() {
        new cron.CronJob('10 * * * * *', this.cronSolrWorker, null, true);
    }

    private async addTasks(tasks) {
        const solrClient = solr.createClient(config.get('solr'));
        solrClient.add(tasks,
            err => {
                if (err) {
                    this.logger.error(JSON.stringify(err));
                } else {
                    solrClient.commit();
                    this.logger.log(`New tasks in SOLR index.`);
                }
            }
        );
    }

    async addTask(task) {
        await new Promise((resolve, reject) => {
            this.redisClient.sadd(REDIS_SET_NAME, JSON.stringify(task), err => {
                if (err) {
                    this.logger.error(JSON.stringify(err));
                    reject(err);
                }
                resolve();
            });
        });
    }

    deleteTaskByTaskId(taskId: number): void {
        const solrClient = solr.createClient(config.get('solr'));
        const field = 'taskId';
        solrClient.delete(field, String(taskId),
            err => {
                if (err) {
                    solrClient.rollback();
                    this.logger.error(JSON.stringify(err));
                } else {
                    solrClient.commit();
                    this.logger.log(`Delete task. Task id: ${taskId}`);
                }
            }
        );
    }

    // TODO: Use the Update method.
    updateTaskStatusByTaskId(taskId: number, task: any): void {
        this.deleteTaskByTaskId(taskId);
        this.addTask(task);
    }

    async search(query: string, userName: string) {
        const solrClient = solr.createClient(config.get('solr'));
        const highlightOptions = {
            on: true,
            fl: 'description, title',
            simplePre: '<b>',
            simplePost: '</b>'
        };
        const solrQuery = solrClient.createQuery()
            .q(`(title:"${query}"^10 OR description:"${query}"^1) AND username:"${userName}"`)
            .start(0)
            .rows(10)
            .hl(highlightOptions)
            .facet({
                field: 'status',
                limit: 10,
                offset: 0,
                sort: 'count',
                mincount: 0,
                missing: false,
                method: 'fc'
            });
        const result = new Promise(resolve => {
            solrClient.search(solrQuery,
                (err, data) => {
                    if (err) {
                        this.logger.error(JSON.stringify(err));
                    } else {
                        resolve(data);
                    }
                }
            );
        });

        return result;
    }
}
