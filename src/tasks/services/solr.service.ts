import { User } from './../../auth/user.entity';
import solr = require('solr-client');
import { Injectable, Logger } from '@nestjs/common';
import config = require('config');

@Injectable()
export class SolrService {
    private readonly logger = new Logger('SolrService');
    private readonly solrClient = solr.createClient(config.get('solr'));

    addTask(task: any): boolean {
        let isIndexed = true;
        this.solrClient.add(task,
            err =>
                {
                    if (err) {
                        isIndexed = false;
                        this.solrClient.rollback();
                        this.logger.error(JSON.stringify(err));
                    } else {
                        this.solrClient.commit();
                        this.logger.log(`New task in SOLR index. Task id: ${task.taskId}`);
                    }
                }
            );
        return isIndexed;
    }

    deleteTaskByTaskId(taskId: number): void {
        const field = 'taskId';
        this.solrClient.delete(field, taskId,
            err =>
                {
                    if (err) {
                        this.solrClient.rollback();
                        this.logger.error(JSON.stringify(err));
                    } else {
                        this.solrClient.commit();
                        this.logger.log(`Delete task. Task id: ${taskId}`);
                    }
                }
            );
    }

    updateTaskStatusByTaskId(status: string, taskId: number): void {
        this.solrClient.atomicUpdate(
            {
                taskId,
                status
            },
            err =>
                {
                    if (err) {
                        this.solrClient.rollback();
                        this.logger.error(JSON.stringify(err));
                    } else {
                        this.solrClient.commit();
                        this.logger.log(`Update task. Task id: ${taskId}`);
                    }
                }
        );
    }

    search(query: string, userName: string) {
        const highlightOptions = {
            on: true,
            fl: 'description',
            simplePre: '<',
            simplePost: '>'
        };
        const solrQuery = this.solrClient.createQuery()
            .q(query)
            .edismax()
            .qf({title : 5 , description : 1})
            .mm(2)
            .start(0)
            .rows(10)
            .hl(highlightOptions)
            .facet({
                field : 'status',
                limit : 10,
                offset : 0,
                sort : 'count',
                mincount : 0,
                missing : false,
                method : 'fc'
             });
        this.solrClient.search(solrQuery,
            err =>
            {
                if (err) {
                    this.logger.error(JSON.stringify(err));
                }
            }
        );
    }
}
