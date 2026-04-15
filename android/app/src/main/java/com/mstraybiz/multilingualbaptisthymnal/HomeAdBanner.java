package com.mstraybiz.multilingualbaptisthymnal;

import android.app.Activity;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;

@CapacitorPlugin(name = "HomeAdBanner")
public class HomeAdBanner extends Plugin {
  private AdView adView;

  @Override
  public void load() {
    super.load();
    Activity activity = getActivity();
    MobileAds.initialize(activity);
  }

  @PluginMethod
  public void show(PluginCall call) {
    Activity activity = getActivity();
    activity.runOnUiThread(() -> {
      if (adView != null) {
        call.resolve(new JSObject().put("status", "already_shown"));
        return;
      }

      FrameLayout container = new FrameLayout(activity);
      FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.WRAP_CONTENT,
        Gravity.BOTTOM
      );
      container.setLayoutParams(params);

      adView = new AdView(activity);
      adView.setAdUnitId("ca-app-pub-6283300909154451/6104372050");
      adView.setAdSize(AdSize.BANNER);
      container.addView(adView);

      ViewGroup root = activity.findViewById(android.R.id.content);
      root.addView(container);

      AdRequest request = new AdRequest.Builder().build();
      adView.loadAd(request);

      call.resolve(new JSObject().put("status", "shown"));
    });
  }

  @PluginMethod
  public void hide(PluginCall call) {
    Activity activity = getActivity();
    activity.runOnUiThread(() -> {
      if (adView != null) {
        ViewGroup parent = (ViewGroup) adView.getParent();
        if (parent != null) {
          ViewGroup root = (ViewGroup) parent.getParent();
          parent.removeAllViews();
          if (root != null) {
            root.removeView(parent);
          }
        }
        adView.destroy();
        adView = null;
      }
      call.resolve(new JSObject().put("status", "hidden"));
    });
  }
}
