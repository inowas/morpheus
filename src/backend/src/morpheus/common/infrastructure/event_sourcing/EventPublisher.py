import inspect
from typing import Type

from morpheus.common.types.event_sourcing.EventBase import EventBase
from morpheus.common.types.event_sourcing.EventEnvelope import EventEnvelope
from morpheus.common.types.event_sourcing.EventMetadata import EventMetadata

ListenToEventAttribute = 'listen_to_event'


def listen_to(event: Type[EventBase]):
    def method_listening_to(listener_method):
        setattr(listener_method, ListenToEventAttribute, event.__name__)
        return listener_method

    return method_listening_to


class EventListenerBase:
    def subscribe_to_transaction(self, transaction):
        raise NotImplementedError()


class EventPublisher:
    def __init__(self):
        self.listeners = {}

    def register(self, event_listener: EventListenerBase):
        listener_methods = [
            getattr(event_listener, attribute) for attribute in dir(event_listener) if hasattr(getattr(event_listener, attribute), ListenToEventAttribute)
        ]

        event_listener_id = id(event_listener)

        for listener_method in listener_methods:
            event_class = getattr(listener_method, ListenToEventAttribute)

            arg_spec = inspect.getfullargspec(listener_method)
            event_arg_type = arg_spec.annotations.get('event')
            metadata_arg_type = arg_spec.annotations.get('metadata')

            if 'event' not in arg_spec.args or event_arg_type is None or not issubclass(event_arg_type, EventBase):
                raise Exception(f'Event listener {listener_method} must have an argument called "event" that should by type hinted with a subclass of {EventBase.__name__}')
            if 'metadata' not in arg_spec.args or metadata_arg_type is None or not issubclass(metadata_arg_type, EventMetadata):
                raise Exception(f'Event listener {listener_method} must have an argument called "metadata" that should by type hinted with a subclass of {EventMetadata.__name__}')

            if event_class not in self.listeners:
                self.listeners[event_class] = {}

            if event_listener_id in self.listeners[event_class]:
                raise Exception("Event handler already registered")

            self.listeners[event_class][event_listener_id] = listener_method

    def publish(self, event_envelope: EventEnvelope):
        event_class = type(event_envelope.get_event()).__name__
        if event_class not in self.listeners:
            return

        listeners = self.listeners[event_class]
        for listener in listeners.values():
            listener(event=event_envelope.get_event(), metadata=event_envelope.get_event_metadata())
