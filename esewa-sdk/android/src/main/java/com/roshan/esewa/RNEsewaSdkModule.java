
package com.roshan.esewa;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Arguments;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.util.SparseArray;;
import android.content.ComponentName;


import com.esewa.android.sdk.payment.ESewaConfiguration;
import com.esewa.android.sdk.payment.ESewaPayment;
import com.esewa.android.sdk.payment.ESewaPaymentActivity;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class RNEsewaSdkModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private static final String CONFIG_ENVIRONMENT = ESewaConfiguration.ENVIRONMENT_TEST;
    private static final int REQUEST_CODE_PAYMENT = 1;
    private ESewaConfiguration eSewaConfiguration;

    private static final String MERCHANT_ID = "JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R";
    private static final String MERCHANT_SECRET_KEY = "BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==";

    private final SparseArray<Promise> mPromises;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            Promise promise = mPromises.get(requestCode);
            if (promise != null) {
                WritableMap result = new WritableNativeMap();
                result.putInt("resultCode", resultCode);
                result.putMap("data", Arguments.makeNativeMap(data.getExtras()));
                promise.resolve(result);
            }
        }
    };


        public RNEsewaSdkModule(ReactApplicationContext reactContext) {
            super(reactContext);
            reactContext.addActivityEventListener(mActivityEventListener);
            mPromises = new SparseArray<>();
            this.reactContext = reactContext;
        }

        @Override
        public String getName() {
            return "RNEsewaSdk";
        }

        @ReactMethod
        public void makePayment(String amount, Promise promise) {

            eSewaConfiguration = new ESewaConfiguration()
                    .clientId(MERCHANT_ID)
                    .secretKey(MERCHANT_SECRET_KEY)
                    .environment(CONFIG_ENVIRONMENT);

            Activity activity = getReactApplicationContext().getCurrentActivity();
            ESewaPayment eSewaPayment = new ESewaPayment(amount, "someProductName", "someUniqueId_" + System.nanoTime(), "http://localhost:3000");
            Intent intent = new Intent(activity,ESewaPaymentActivity.class);
            intent.putExtra(ESewaConfiguration.ESEWA_CONFIGURATION, eSewaConfiguration);
            intent.putExtra(ESewaPayment.ESEWA_PAYMENT, eSewaPayment);
            activity.startActivityForResult(intent, REQUEST_CODE_PAYMENT);
            mPromises.put(REQUEST_CODE_PAYMENT, promise);
        }
//    @Override
//    public void initialize() {
//        super.initialize();
//        getReactApplicationContext().addActivityEventListener(this);
//    }
//
//    @Override
//    public void onCatalystInstanceDestroy() {
//        super.onCatalystInstanceDestroy();
//        getReactApplicationContext().removeActivityEventListener(this);
//    }



    @ReactMethod
    public void resolveActivity(Promise promise) {
        Activity activity = getReactApplicationContext().getCurrentActivity();
        Intent intent = new Intent(activity,ESewaPaymentActivity.class);
        ComponentName componentName = intent.resolveActivity(activity.getPackageManager());
        if (componentName == null) {
            promise.resolve(null);
            return;
        }

        WritableMap map = new WritableNativeMap();
        map.putString("class", componentName.getClassName());
        map.putString("package", componentName.getPackageName());
        promise.resolve(map);
    }

    }

