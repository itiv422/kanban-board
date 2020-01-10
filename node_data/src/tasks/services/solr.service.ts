import solr = require('solr-client');
import { Injectable, Logger } from '@nestjs/common';
import config = require('config');
import redis = require('redis');

@Injectable()
export class SolrService {
    private readonly logger = new Logger('SolrService');
    private readonly redisClient = redis.createClient({host: 'localhost', port: 6379});

    async addTask(task: any) {
        // let isIndexed = true;
        // const solrClient = solr.createClient(config.get('solr'));
        // solrClient.add(task,
        //     err => {
        //         if (err) {
        //             isIndexed = false;
        //             solrClient.rollback();
        //             this.logger.error(JSON.stringify(err));
        //         } else {
        //             solrClient.commit();
        //             this.logger.log(`New task in SOLR index. Task id: ${task.taskId}`);
        //         }
        //     }
        // );

        // return isIndexed;
        this.redisClient.sadd('trololo2', JSON.stringify(task));

        const elementCount: number = await new Promise(resolve => {
          this.redisClient.scard('trololo2', (err, value) => resolve(value));
        });

        if (elementCount > 0) {
          this.redisClient.spop('trololo2', elementCount, (err, values) => console.log(values));
        }
    }

    deleteTaskByTaskId(taskId: number): void {
        // const solrClient = solr.createClient(config.get('solr'));
        // const field = 'taskId';
        // solrClient.delete(field, String(taskId),
        //     err => {
        //         if (err) {
        //             solrClient.rollback();
        //             this.logger.error(JSON.stringify(err));
        //         } else {
        //             solrClient.commit();
        //             this.logger.log(`Delete task. Task id: ${taskId}`);
        //         }
        //     }
        // );
    }

    updateTaskStatusByTaskId(taskId: number, task: any): void {
        // this.deleteTaskByTaskId(taskId);
        // this.addTask(task);
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
