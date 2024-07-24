ARG KEYCLOAK_VERSION=25.0.1

FROM keycloak/keycloak:$KEYCLOAK_VERSION AS builder_base

ENV KC_HEALTH_ENABLED=true
ENV KC_DB=postgres
WORKDIR /opt/keycloak


FROM builder_base as builder_development

ENV KC_METRICS_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build


FROM builder_base AS builder_production

RUN /opt/keycloak/bin/kc.sh build


FROM keycloak/keycloak:$KEYCLOAK_VERSION AS development

COPY --from=builder_development /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]


FROM keycloak/keycloak:$KEYCLOAK_VERSION AS production

COPY --from=builder_production /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
