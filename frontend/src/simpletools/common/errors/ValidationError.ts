interface IValidationMessage {
  message: string,
  args: {
    field_key?: string;
  }
}

class ValidationError {

  private constructor(private messages: IValidationMessage[] = []) {
  }

  public static new() {
    return new ValidationError();
  }

  public withMessages(messages: IValidationMessage[]) {
    return new ValidationError(messages);
  }

  public withAddedMessage(message: string, args: {} = {}) {
    this.messages.push({message, args});
    return new ValidationError(this.messages);
  }

  public getMessages() {
    return this.messages;
  }

  public getMessage() {
    return this.messages.shift();
  }
}

export default ValidationError;
