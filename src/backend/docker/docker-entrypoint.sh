#!/bin/sh

set -e

entrypoint_log() {
    echo "$@"
}

entrypoint_log "$0: info: Starting $0"

entypointPath=/app/docker/docker-entrypoint.d/

if find "$entypointPath" -mindepth 1 -maxdepth 1 -type f -print -quit 2>/dev/null | read -r v; then
    entrypoint_log "$0: $entypointPath is not empty, will attempt to perform configuration"
    entrypoint_log "$0: Looking for shell scripts in $entypointPath"
    find "$entypointPath" -follow -type f -print | sort -V | while read -r script; do
        case "$script" in
            *.envsh)
                if [ -x "$script" ]; then
                    entrypoint_log "$0: Sourcing $script";
                    . "$script"
                else
                    # warn on shell scripts without exec bit
                    entrypoint_log "$0: Ignoring $script, not executable";
                fi
                ;;
            *.sh)
                if [ -x "$script" ]; then
                    entrypoint_log "$0: Launching $script";
                    "$script"
                else
                    # warn on shell scripts without exec bit
                    entrypoint_log "$0: Ignoring $script, not executable";
                fi
                ;;
            *) entrypoint_log "$0: Ignoring $script";;
        esac
    done

    entrypoint_log "$0: Configuration complete; ready for start up"
else
    entrypoint_log "$0: No files found in $entypointPath, skipping configuration"
fi

exec "$@"
