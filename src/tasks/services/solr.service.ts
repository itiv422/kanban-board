import solr = require('solr-client');
import { Injectable, Logger } from '@nestjs/common';
import config = require('config');

@Injectable()
export class SolrService {
    private readonly logger = new Logger('SolrService');

    async addTask(task: any):Promise<boolean> {
        const solrClient = solr.createClient(config.get('solr'));
        let isIndexed = true;
        solrClient.autoCommit = true;
        solrClient.add(task,
            (err, obj) =>
                {
                    if (err) {
                        isIndexed = false;
                        this.logger.error(JSON.stringify(err));
                    } else {
                        this.logger.log(`New object in SOLR index: ${JSON.stringify(obj)}`);
                    }
                }
            );
        solrClient.commit(
            (err, obj) => {
                if (err) {
                    isIndexed = false;
                    this.logger.error(JSON.stringify(err));
                }  else {
                    this.logger.log(JSON.stringify(obj));
                }
            });
        return isIndexed;
    }
}
