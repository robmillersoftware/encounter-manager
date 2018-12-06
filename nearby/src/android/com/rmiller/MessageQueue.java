package com.rmiller;

import java.util.List;
import java.util.ArrayList;
import org.json.JSONArray;

public class MessageQueue {
  List<NearbyPayload> messages;
  static MessageQueue _instance;

  public static MessageQueue getInstance() {
    if (_instance == null) {
      _instance = new MessageQueue();
    }

    return _instance;
  }

  private MessageQueue() {
    messages = new ArrayList<NearbyPayload>();
  }

  public void addMessage(NearbyPayload message) {
    this.messages.add(message);
  }

  public boolean hasMessages() {
    return messages.size() > 0;
  }

  public List<NearbyPayload> getMessages() {
    return messages;
  }

  public String getMessagesAsJSON() {
    JSONArray rtn = new JSONArray();

    for(NearbyPayload msg : this.messages) {
      rtn.put(msg.toJSON());
    }

    this.messages.clear();
    return rtn.toString();
  }
}
