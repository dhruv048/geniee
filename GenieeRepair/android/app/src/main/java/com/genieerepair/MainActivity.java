package com.genieerepair;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;
import android.widget.LinearLayout;


import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
//  @Override
//  protected String getMainComponentName() {
//    return "GenieeRepair";
//  }
//
//  @Override
//  protected void onCreate(Bundle savedInstanceState) {
//    SplashScreen.show(this);
//    super.onCreate(savedInstanceState);
//  }

//  @Override
//  protected void onCreate(Bundle savedInstanceState) {
//      super.onCreate(savedInstanceState);
//      setContentView(this.createSplashLayout());
//  }
//
//    public LinearLayout createSplashLayout() {
//        LinearLayout splash = new LinearLayout(this);
//        Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(), R.drawable.launch_screen);
//        splash.setBackground(launch_screen_bitmap);
//
//        return splash;
//    }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this,true);
      super.onCreate(savedInstanceState);
//      setContentView(R.layout.launch_screen);
  }
}
