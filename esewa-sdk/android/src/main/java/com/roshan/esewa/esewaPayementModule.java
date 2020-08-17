//
//package com.roshan.esewa;
//
//import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.bridge.ReactContextBaseJavaModule;
//import com.facebook.react.bridge.ReactMethod;
//import com.facebook.react.bridge.Callback;
//import com.facebook.react.bridge.Promise;
//
//import com.facebook.react.bridge.ActivityEventListener;
//import com.facebook.react.bridge.BaseActivityEventListener;
//
//
//import android.app.Activity;
//import android.content.Intent;
//import android.os.Bundle;
//import android.util.Log;
//import android.view.View;
//import android.widget.Button;
//import android.widget.Toast;
//
//
//import com.esewa.android.sdk.payment.ESewaConfiguration;
//import com.esewa.android.sdk.payment.ESewaPayment;
//import com.esewa.android.sdk.payment.ESewaPaymentActivity;
//import com.facebook.react.modules.core.DeviceEventManagerModule;
//
//public class RNEsewaSdkModule extends ReactContextBaseJavaModule   {
//
//    private final ReactApplicationContext reactContext;
//
//    private static final String CONFIG_ENVIRONMENT = ESewaConfiguration.ENVIRONMENT_TEST;
//    private static final int REQUEST_CODE_PAYMENT = 1;
//    private ESewaConfiguration eSewaConfiguration;
//
//    private static final String MERCHANT_ID = "JB0BBQ4aD0UqIThFJwAKBgAXEUkEGQUBBAwdOgABHD4DChwUAB0R";
//    private static final String MERCHANT_SECRET_KEY = "BhwIWQQADhIYSxILExMcAgFXFhcOBwAKBgAXEQ==";
//
//    private Promise mEsewaPromise;
//
//    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
//        @Override
//        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
//            super.onActivityResult(requestCode, resultCode, data);
//
//            if (requestCode == REQUEST_CODE_PAYMENT) {
//                if (mEsewaPromise != null) {
//                    if (resultCode == Activity.RESULT_CANCELED) {
//                        mEsewaPromise.reject("Payment was cancelled");
//                    } else if (resultCode == Activity.RESULT_OK) {
////            if (resultCode == RESULT_OK) {
//                        String s = data.getStringExtra(ESewaPayment.EXTRA_RESULT_MESSAGE);
//                        Log.d("Proof of Payment", s);
//                        Toast.makeText(getReactApplicationContext(), "SUCCESSFUL PAYMENT" , Toast.LENGTH_SHORT).show();
//                        mEsewaPromise.resolve(data.getData());
//                        reactContext
//                                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                                .emit("onEsewaComplete", data);
//                        //   Toast.makeText(this, "SUCCESSFUL PAYMENT", Toast.LENGTH_SHORT).show();
////            } else if (resultCode == RESULT_CANCELED) {
////                Toast.makeText(this, "Canceled By User", Toast.LENGTH_SHORT).show();
////            } else if (resultCode == ESewaPayment.RESULT_EXTRAS_INVALID) {
////                String s = data.getStringExtra(ESewaPayment.EXTRA_RESULT_MESSAGE);
////                Log.i("Proof of Payment", s);
////            }
//                    }
//                }
//                mEsewaPromise=null;
//            }
//
//        }
//    }
//
//            ;
//
//
//    public RNEsewaSdkModule(ReactApplicationContext reactContext) {
//        super(reactContext);
//        reactContext.addActivityEventListener(mActivityEventListener);
//        this.reactContext = reactContext;
//
//    }
//
//    @Override
//    public String getName() {
//        return "RNEsewaSdk";
//    }
//
//    @ReactMethod
//    public void makePayment(String amount,final Promise promise) {
//
//        eSewaConfiguration = new ESewaConfiguration()
//                .clientId(MERCHANT_ID)
//                .secretKey(MERCHANT_SECRET_KEY)
//                .environment(CONFIG_ENVIRONMENT);
//        mEsewaPromise=promise;
//        try {
//            Activity activity = getReactApplicationContext().getCurrentActivity();
//            ESewaPayment eSewaPayment = new ESewaPayment(amount, "someProductName", "someUniqueId_" + System.nanoTime(), "http://localhost:3000");
//            Intent intent = new Intent(activity, ESewaPaymentActivity.class);
//            intent.putExtra(ESewaConfiguration.ESEWA_CONFIGURATION, eSewaConfiguration);
//            intent.putExtra(ESewaPayment.ESEWA_PAYMENT, eSewaPayment);
//            activity.startActivityForResult(intent, REQUEST_CODE_PAYMENT);
//        } catch (Exception e) {
//            mEsewaPromise.reject(  e);
//            mEsewaPromise = null;
//        }
//    }
//
//
//}
//
