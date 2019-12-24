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
            (err, obj) =>
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

    deleteTaskbyTaskId(taskId: number) {
        const field = 'taskId';
        this.solrClient.delete(field, taskId,
            (err, obj) =>
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
}
