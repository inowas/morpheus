TRAEFIK_NETWORK=traefik

# Certificate resolver
# possible values:
# - letsencrypt: use Let's Encrypt to generate certificates
# - tud-resolver: use the resolver provided by TU-Dresden
TRAEFIK_CERT_RESOLVER=letsencrypt

COMPOSE_PROJECT_NAME=datahub-development
DOCKERHOST=
DOCKER_HOST_IP=
# See https://github.com/containers/podman/issues/13889
# DOCKER_BUILDKIT=0
DOCKER_ENV=production
# See https://github.com/geosolutions-it/geonode-generic/issues/28
# to see why we force API version to 1.24
DOCKER_API_VERSION="1.24"
BACKUPS_VOLUME_DRIVER=local

C_FORCE_ROOT=1
FORCE_REINIT=false
INVOKE_LOG_STDOUT=true

# LANGUAGE_CODE=pt
# LANGUAGES=(('en-us','English'),('it-it','Italiano'))

DJANGO_SETTINGS_MODULE=datahub.settings
GEONODE_INSTANCE_NAME=geonode

# #################
# backend
# #################
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres_password
GEONODE_DATABASE=datahub
GEONODE_DATABASE_PASSWORD=geonode_database_password
GEONODE_GEODATABASE=datahub_data
GEONODE_GEODATABASE_PASSWORD=geonode_geodatabase_password
GEONODE_DATABASE_SCHEMA=public
GEONODE_GEODATABASE_SCHEMA=public
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_URL=postgis://datahub:geonode_database_password@db:5432/datahub
GEODATABASE_URL=postgis://datahub_data:geonode_geodatabase_password@db:5432/datahub_data
GEONODE_DB_CONN_MAX_AGE=0
GEONODE_DB_CONN_TOUT=5
DEFAULT_BACKEND_DATASTORE=datastore
BROKER_URL=amqp://guest:guest@rabbitmq:5672/
CELERY_BEAT_SCHEDULER=celery.beat:PersistentScheduler
ASYNC_SIGNALS=True

SITEURL=https://dev.datahub.inowas.com/

ALLOWED_HOSTS="['django', '*', 'datahub.inowas.com']"

# Data Uploader
DEFAULT_BACKEND_UPLOADER=geonode.importer
TIME_ENABLED=True
MOSAIC_ENABLED=False
HAYSTACK_SEARCH=False
HAYSTACK_ENGINE_URL=http://elasticsearch:9200/
HAYSTACK_ENGINE_INDEX_NAME=haystack
HAYSTACK_SEARCH_RESULTS_PER_PAGE=200

# #################
# Jenkins
# CI/CD Server
# #################
JENKINS_HTTP_PORT=9080
JENKINS_HTTPS_PORT=9443

# #################
# nginx
# HTTPD Server
# #################
GEONODE_LB_HOST_IP=dev.datahub.inowas.com
GEONODE_LB_PORT=80
PUBLIC_PORT=443

# IP or domain name and port where the server can be reached on HTTPS (leave HOST empty if you want to use HTTP only)
# port where the server can be reached on HTTPS
HTTP_HOST=dev.datahub.inowas.com
HTTPS_HOST=

HTTP_PORT=80
HTTPS_PORT=443

# Let's Encrypt certificates for https encryption. You must have a domain name as HTTPS_HOST (doesn't work
# with an ip) and it must be reachable from the outside. This can be one of the following :
# disabled : we do not get a certificate at all (a placeholder certificate will be used)
# staging : we get staging certificates (are invalid, but allow to test the process completely and have much higher limit rates)
# production : we get a normal certificate (default)
LETSENCRYPT_MODE=disabled
# LETSENCRYPT_MODE=staging
# LETSENCRYPT_MODE=production

RESOLVER=127.0.0.11

# #################
# geoserver
# #################
GEOSERVER_WEB_UI_LOCATION=https://dev.datahub.inowas.com/geoserver/
GEOSERVER_PUBLIC_LOCATION=https://dev.datahub.inowas.com/geoserver/
GEOSERVER_LOCATION=https://dev.datahub.inowas.com/geoserver/
GEOSERVER_ADMIN_USER=admin
GEOSERVER_ADMIN_PASSWORD=geoserver_admin_password

OGC_REQUEST_TIMEOUT=30
OGC_REQUEST_MAX_RETRIES=1
OGC_REQUEST_BACKOFF_FACTOR=0.3
OGC_REQUEST_POOL_MAXSIZE=10
OGC_REQUEST_POOL_CONNECTIONS=10

# Java Options & Memory
ENABLE_JSONP=true
outFormat=text/javascript
GEOSERVER_JAVA_OPTS=-Djava.awt.headless=true -Xms2G -Xmx4G -Dgwc.context.suffix=gwc -XX:+UnlockDiagnosticVMOptions -XX:+LogVMOutput -XX:LogFile=/var/log/jvm.log -XX:PerfDataSamplingInterval=500 -XX:SoftRefLRUPolicyMSPerMB=36000 -XX:-UseGCOverheadLimit -XX:+UseConcMarkSweepGC -XX:ParallelGCThreads=4 -Dfile.encoding=UTF8 -Djavax.servlet.request.encoding=UTF-8 -Djavax.servlet.response.encoding=UTF-8 -Duser.timezone=GMT -Dorg.geotools.shapefile.datetime=false -DGS-SHAPEFILE-CHARSET=UTF-8 -DGEOSERVER_CSRF_DISABLED=true -DPRINT_BASE_URL=https://dev.datahub.inowas.com/geoserver/pdf -DALLOW_ENV_PARAMETRIZATION=true -Xbootclasspath/a:/usr/local/tomcat/webapps/geoserver/WEB-INF/lib/marlin-0.9.3-Unsafe.jar -Dsun.java2d.renderer=org.marlin.pisces.MarlinRenderingEngine

# #################
# Security
# #################
# Admin Settings
#
# ADMIN_PASSWORD is used to overwrite the GeoNode admin password **ONLY** the first time
# GeoNode is run. If you need to overwrite it again, you need to set the env var FORCE_REINIT,
# otherwise the invoke updateadmin task will be skipped and the current password already stored
# in DB will honored.

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin_password
ADMIN_EMAIL=admin_email@inowas.com

# EMAIL Notifications
EMAIL_ENABLE=False
DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
DJANGO_EMAIL_HOST=localhost
DJANGO_EMAIL_PORT=25
DJANGO_EMAIL_HOST_USER=
DJANGO_EMAIL_HOST_PASSWORD=
DJANGO_EMAIL_USE_TLS=False
DJANGO_EMAIL_USE_SSL=False
DEFAULT_FROM_EMAIL='from_email@inowas.com' # eg Company <no-reply@company.org>

# Session/Access Control
LOCKDOWN_GEONODE=False
X_FRAME_OPTIONS="SAMEORIGIN"
SESSION_EXPIRED_CONTROL_ENABLED=True
DEFAULT_ANONYMOUS_VIEW_PERMISSION=True
DEFAULT_ANONYMOUS_DOWNLOAD_PERMISSION=True

CORS_ALLOW_ALL_ORIGINS=True
GEOSERVER_CORS_ENABLED=True
GEOSERVER_CORS_ALLOWED_ORIGINS=*
GEOSERVER_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,HEAD,OPTIONS
GEOSERVER_CORS_ALLOWED_HEADERS=*

# Users Registration
ACCOUNT_OPEN_SIGNUP=True
ACCOUNT_EMAIL_REQUIRED=True
ACCOUNT_APPROVAL_REQUIRED=False
ACCOUNT_CONFIRM_EMAIL_ON_GET=False
ACCOUNT_EMAIL_VERIFICATION=none
ACCOUNT_AUTHENTICATION_METHOD=username_email
AUTO_ASSIGN_REGISTERED_MEMBERS_TO_REGISTERED_MEMBERS_GROUP_NAME=True

# OAuth2
OAUTH2_API_KEY=
OAUTH2_CLIENT_ID=client_id
OAUTH2_CLIENT_SECRET=client_secret

# GeoNode APIs
API_LOCKDOWN=False
TASTYPIE_APIKEY=

# #################
# Production and
# Monitoring
# #################
DEBUG=False

SECRET_KEY="T|R+*R%QOQfmneFC~|*xXc!)ftN~~hs0}t~%QB\-1gge|mKCOm"

STATIC_ROOT=/mnt/volumes/statics/static/
MEDIA_ROOT=/mnt/volumes/statics/uploaded/
GEOIP_PATH=/mnt/volumes/statics/geoip.db

CACHE_BUSTING_STATIC_ENABLED=False

MEMCACHED_ENABLED=False
MEMCACHED_BACKEND=django.core.cache.backends.memcached.MemcachedCache
MEMCACHED_LOCATION=127.0.0.1:11211
MEMCACHED_LOCK_EXPIRE=3600
MEMCACHED_LOCK_TIMEOUT=10

MAX_DOCUMENT_SIZE=2
CLIENT_RESULTS_LIMIT=5
API_LIMIT_PER_PAGE=1000

# GIS Client
GEONODE_CLIENT_LAYER_PREVIEW_LIBRARY=mapstore
MAPBOX_ACCESS_TOKEN=
BING_API_KEY=
GOOGLE_API_KEY=

# Monitoring
MONITORING_ENABLED=False
MONITORING_DATA_TTL=365
USER_ANALYTICS_ENABLED=True
USER_ANALYTICS_GZIP=True
CENTRALIZED_DASHBOARD_ENABLED=False
MONITORING_SERVICE_NAME=local-geonode
MONITORING_HOST_NAME=geonode

# Other Options/Contribs
MODIFY_TOPICCATEGORY=True
AVATAR_GRAVATAR_SSL=True
EXIF_ENABLED=True
CREATE_LAYER=True
FAVORITE_ENABLED=True

# Advanced Workflow
RESOURCE_PUBLISHING=False
ADMIN_MODERATE_UPLOADS=False

# LDAP
LDAP_ENABLED=False
LDAP_SERVER_URL=ldap://<the_ldap_server>
LDAP_BIND_DN=uid=ldapinfo,cn=users,dc=ad,dc=example,dc=org
LDAP_BIND_PASSWORD=<something_secret>
LDAP_USER_SEARCH_DN=dc=ad,dc=example,dc=org
LDAP_USER_SEARCH_FILTERSTR=(&(uid=%(user)s)(objectClass=person))
LDAP_GROUP_SEARCH_DN=cn=groups,dc=ad,dc=example,dc=org
LDAP_GROUP_SEARCH_FILTERSTR=(|(cn=abt1)(cn=abt2)(cn=abt3)(cn=abt4)(cn=abt5)(cn=abt6))
LDAP_GROUP_PROFILE_MEMBER_ATTR=uniqueMember

# CELERY
# expressed in KB
CELERY__MAX_MEMORY_PER_CHILD="200000"
# ##
# Note right autoscale value must coincide with worker concurrency value
CELERY__AUTOSCALE_VALUES="15,10"
CELERY__WORKER_CONCURRENCY="10"
# ##
CELERY__OPTS="--without-gossip --without-mingle -Ofair -B -E"
CELERY__BEAT_SCHEDULE="/mnt/volumes/statics/celerybeat-schedule"
CELERY__LOG_LEVEL="INFO"
CELERY__LOG_FILE="/var/log/celery.log"
CELERY__WORKER_NAME="worker1@%h"

# PostgreSQL
POSTGRESQL_MAX_CONNECTIONS=200

# Common containers restart policy
RESTART_POLICY_CONDITION="on-failure"
RESTART_POLICY_DELAY="5s"
RESTART_POLICY_MAX_ATTEMPTS="3"
RESTART_POLICY_WINDOW=120s

DEFAULT_MAX_UPLOAD_SIZE=5368709120
DEFAULT_MAX_PARALLEL_UPLOADS_PER_USER=5
