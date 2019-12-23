import { Task } from './../task.entity';
import solr = require('solr-client');
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SolrService {
    readonly solrClient = solr.createClient();
    private readonly logger = new Logger('SolrService');

    async addTask(task: any) {
        this.solrClient.add(task,
            (err, obj) =>
                {
                    if (err) {
                        this.logger.error(JSON.stringify(err));
                    } else {
                        this.logger.log(`New object in SOLR index: ${JSON.stringify(obj)}`);
                    }
                }
            );
    }
}
