package com.rmiller;

import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.Payload;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.apache.cordova.CallbackContext;
import java.io.UnsupportedEncodingException;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import android.util.Log;

public class NearbyPayloadCb extends PayloadCallback {
  private CallbackContext callback;
  private String identifier;

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public void setHandler(CallbackContext context) {
    this.callback = context;
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
          Log.d("NearbyPlugin", "Got message: " + new String(payload.asBytes(), "UTF-8"));

          String messagePayload = new String(payload.asBytes());
          PluginResult result = new PluginResult(Status.OK, messagePayload);
          result.setKeepCallback(true);
          this.callback.sendPluginResult(result);
        } catch (UnsupportedEncodingException e) {
          Log.e("NearbyPlugin", "UTF-8 is unsupported");
        }
        break;
    }
  }

  @Override
  public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {}
}
