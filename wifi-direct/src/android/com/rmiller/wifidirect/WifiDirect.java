package com.rmiller.wifidirect;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

import java.util.Date;

public class WifiDirect extends CordovaPlugin {
  private static final String TAG = "WifiDirect";
  private static final String [] permissions = {
    Manifest.permission.ACCESS_COARSE_LOCATION,
    Manifest.permission.INTERNET,
    Manifest.permission.ACCESS_WIFI_STATE,
    Manifest.permission.CHANGE_WIFI_STATE
  }

  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    Log.d(TAG, "Initializing WifiDirect");
  }

  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    if(action.equals("echo")) {
      String phrase = args.getString(0);
      // Echo back the first argument
      Log.d(TAG, phrase);
    } else if(action.equals("getDate")) {
      // An example of returning data back to the web layer
      final PluginResult result = new PluginResult(PluginResult.Status.OK, (new Date()).toString());
      callbackContext.sendPluginResult(result);
    }
    return true;
  }

}
