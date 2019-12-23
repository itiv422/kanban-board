FROM solr:latest

EXPOSE 8983
COPY solrhome /solrhome

USER root
RUN chmod -R 777 /solrhome
USER solr

CMD ["solr", "start", "-f", "-s", "/solrhome", "-t", "/solrhome/solrindex"]
