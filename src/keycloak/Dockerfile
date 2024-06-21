FROM keycloak/keycloak:25.0 as builder_base

ENV KC_HEALTH_ENABLED=true
ENV KC_DB=postgres
WORKDIR /opt/keycloak


FROM builder_base as builder_development

ENV KC_METRICS_ENABLED=true
RUN /opt/keycloak/bin/kc.sh build



FROM builder_base as builder_production

RUN /opt/keycloak/bin/kc.sh build



FROM keycloak/keycloak:22.0 as development

COPY --from=builder_development /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]


FROM keycloak/keycloak:22.0 as production

COPY --from=builder_production /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]



