package com.rmiller;

import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.Payload;
import java.io.UnsupportedEncodingException;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;

public class NearbyPayloadCb extends PayloadCallback {
  Context context;

  public NearbyPayloadCb(Context context) {
    this.context = context;
  }

  @Override
  public void onPayloadReceived(String endpointId, Payload payload) {
    switch(payload.getType()) {
      case Payload.Type.STREAM:
        break;
      case Payload.Type.FILE:
        break;
      case Payload.Type.BYTES:
        try {
          Log.d("NearbyPlugin", "Got message: " + new String(payload.asBytes(), "UTF-8") + " from endopint: " + endpointId);

          //Build a payload object on this end and add the endpointId as the src
          String messagePayload = new String(payload.asBytes());
          NearbyPayload nearbyPayload = new NearbyPayload(messagePayload);
          nearbyPayload.source = endpointId;

          //MessageQueue.getInstance().addMessage(nearbyPayload);
          final Intent intent = new Intent("detail");
          Bundle b = new Bundle();
          b.putString("detail", nearbyPayload.toJSON());
          intent.putExtras(b);
          LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
        } catch (UnsupportedEncodingException e) {
          Log.e("NearbyPlugin", "UTF-8 is unsupported");
        }
        break;
    }
  }

  @Override
  public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {}
}
