/* eslint-disable react-native/no-inline-styles */
/**
 * This source code is exported from pxCode, you can get more document from https://www.pxcode.io
 */
import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Image, ImageBackground} from 'react-native';
import SplashScreen from 'react-native-lottie-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
export default function Geniee(props) {
  useEffect(async () => {
    SplashScreen.hide();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'green'}}>
      <View
        style={{
          marginTop: 150,
          width: '100%',
          height: 60,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: 60,
            backgroundColor: '#FFFFFF',
            boxShadow: '0px -8px 16px rgba(0, 0, 0, 0.03)',
            borderTopRightRadius: 15,
            // position: 'relative',
          }}
        />
        <View
          style={{
            alignSelf: 'flex-end',
            width: 80,
            height: 60,
          }}>
          <LinearGradient
            locations={[0.4, 1]}
            colors={['transparent', '#FFFFFF']}
            style={{
              alignSelf: 'flex-start',
              width: 80,
              height: 20,
            }}
          />
          <View
            style={{
              alignSelf: 'flex-end',
              width: 80,
              height: 40,
              backgroundColor: '#FFF',
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: 60,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 15,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: -30,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.4,
            // shadowRadius: 3,
            elevation: 5,
            alignSelf: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'red',
              width: 70,
              height: 70,
              borderRadius: 35,
              alignSelf: 'center',
              // filter: 'drop-shadow(0 8 16 rgba(50, 102, 255, 0.25))',
            }}
          />
        </View>
      </View>
    </View>
    // <View style={[styles.group, styles.group_layout]}>
    //   <View style={[styles.group1, styles.group1_layout]}>
    //     {/* <View style={[styles.content_box, styles.content_box_layout]}>
    //       <View style={styles.content_box_space} />
    //       <View style={styles.content_box_col}>
    //         <View style={[styles.text_body_box, styles.text_body_box_layout]}>
    //           <Text style={styles.text_body} ellipsizeMode={'clip'}>
    //             {'Message(2)'}
    //           </Text>
    //         </View>
    //       </View>
    //       <View style={styles.content_box_space1} />
    //       <View style={styles.content_box_col1}>
    //         <View style={[styles.flex, styles.flex_layout]}>
    //           <View style={styles.flex_row}>
    //             <View
    //               style={[
    //                 styles.notification_box,
    //                 styles.notification_box_layout,
    //               ]}>
    //               <Text style={styles.notification} ellipsizeMode={'clip'}>
    //                 {'Notification'}
    //               </Text>
    //             </View>
    //           </View>
    //           <View style={styles.flex_row}>
    //             <View style={[styles.line, styles.line_layout]} />
    //           </View>
    //         </View>
    //       </View>
    //       <View style={styles.content_box_space2} />
    //       <View style={styles.content_box_col2}>
    //         <View style={[styles.group2, styles.group2_layout]}>
    //           <View
    //             style={[styles.annoucement_box, styles.annoucement_box_layout]}>
    //             <Text style={styles.annoucement} ellipsizeMode={'clip'}>
    //               {'Annoucement'}
    //             </Text>
    //           </View>
    //         </View>
    //       </View>
    //     </View> */}

    //     <View style={[styles.group3, styles.group3_layout]}>
    //       <View style={[styles.group4, styles.group4_layout]}>
    //         {/* <View style={[styles.flex1, styles.flex1_layout]}>
    //           <View style={styles.flex1_row}>
    //             <View style={[styles.flex2, styles.flex2_layout]}>
    //               <View style={styles.flex2_col}>
    //                 <View
    //                   style={[
    //                     styles.highlights_box,
    //                     styles.highlights_box_layout,
    //                   ]}>
    //                   <Text style={styles.highlights} ellipsizeMode={'clip'}>
    //                     {'9:41'}
    //                   </Text>
    //                 </View>
    //               </View>
    //               <View style={styles.flex2_space} />
    //               <View style={styles.flex2_col1}>
    //                 <ImageBackground
    //                   style={[styles.img, styles.img_layout]}
    //                   source={require('../assets/470d73082a1983e6f78a5ba6886ee37f.png')}
    //                 />
    //               </View>
    //               <View style={styles.flex2_space1} />
    //               <View style={styles.flex2_col2}>
    //                 <ImageBackground
    //                   style={[styles.img, styles.img_layout1]}
    //                   source={require('../assets/3d69814d95831810024aaa4af6a9e128.png')}
    //                 />
    //               </View>
    //               <View style={styles.flex2_space2} />
    //               <View style={styles.flex2_col3}>
    //                 <View
    //                   style={[styles.cover_group, styles.cover_group_layout]}>
    //                   <View
    //                     style={[styles.background, styles.background_layout]}
    //                   />
    //                   <View style={[styles.rect, styles.rect_layout]} />
    //                 </View>
    //               </View>
    //               <View style={styles.flex2_space3} />
    //               <View style={styles.flex2_col4}>
    //                 <ImageBackground
    //                   style={[styles.img, styles.img_layout2]}
    //                   source={require('../assets/1b682b91cacea2eec2fa953664eec48b.png')}
    //                 />
    //               </View>
    //             </View>
    //           </View>
    //           <View style={styles.flex1_row}>
    //             <View style={[styles.inbox_box, styles.inbox_box_layout]}>
    //               <Text style={styles.inbox} ellipsizeMode={'clip'}>
    //                 {'Inbox'}
    //               </Text>
    //             </View>
    //           </View>
    //           <View style={styles.flex1_row}>
    //             <View style={[styles.line1, styles.line1_layout]} />
    //           </View>
    //           <View style={styles.flex1_row}>
    //             <View style={[styles.flex3, styles.flex3_layout]}>
    //               <View style={styles.flex3_col}>
    //                 <ImageBackground
    //                   style={[styles.icon, styles.icon_layout]}
    //                   source={require('../assets/6e5577e121ea1e2244cdb97fdd496594.png')}
    //                 />
    //               </View>
    //               <View style={styles.flex3_space} />
    //               <View style={styles.flex3_col1}>
    //                 <View style={[styles.flex, styles.flex_layout1]}>
    //                   <View style={styles.flex4_row}>
    //                     <View
    //                       style={[
    //                         styles.text_body_box1,
    //                         styles.text_body_box1_layout,
    //                       ]}>
    //                       <Text
    //                         style={styles.text_body1}
    //                         ellipsizeMode={'clip'}>
    //                         {'Need to fix my tap'}
    //                       </Text>
    //                     </View>
    //                   </View>
    //                   <View style={styles.flex4_row}>
    //                     <View
    //                       style={[
    //                         styles.small_text_body_box,
    //                         styles.small_text_body_box_layout,
    //                       ]}>
    //                       <Text
    //                         style={styles.small_text_body}
    //                         ellipsizeMode={'clip'}>
    //                         <Text style={styles.small_text_bodySpan0}>
    //                           {'By '}
    //                         </Text>
    //                         <Text style={styles.small_text_bodySpan1}>
    //                           {'Sajnay Kumar Shrestha'}
    //                         </Text>
    //                       </Text>
    //                     </View>
    //                   </View>
    //                   <View style={styles.flex4_row}>
    //                     <View
    //                       style={[
    //                         styles.small_text_body_box,
    //                         styles.small_text_body_box_layout,
    //                       ]}>
    //                       <Text
    //                         style={styles.small_text_body}
    //                         ellipsizeMode={'clip'}>
    //                         <Text style={styles.small_text_body1Span0}>
    //                           {'Until: '}
    //                         </Text>
    //                         <Text style={styles.small_text_body1Span1}>
    //                           {'15 Sep'}
    //                         </Text>
    //                       </Text>
    //                     </View>
    //                   </View>
    //                 </View>
    //               </View>
    //             </View>
    //           </View>
    //           <View style={styles.flex1_row}>
    //             <View
    //               style={[
    //                 styles.small_text_body_box,
    //                 styles.small_text_body_box_layout2,
    //               ]}>
    //               <Text style={styles.small_text_body} ellipsizeMode={'clip'}>
    //                 {'Naya Baneshwor, Kathmandu'}
    //               </Text>
    //             </View>
    //           </View>
    //           <View style={styles.flex1_row}>
    //             <View style={[styles.group5, styles.group5_layout]}>
    //               <View
    //                 style={[
    //                   styles.text_body_box,
    //                   styles.text_body_box_layout1,
    //                 ]}>
    //                 <Text style={styles.text_body2} ellipsizeMode={'clip'}>
    //                   {'Place my Bid'}
    //                 </Text>
    //               </View>
    //             </View>
    //           </View>
    //         </View> */}

    //         <ImageBackground
    //           style={[styles.cover_group1, styles.cover_group1_layout]}
    //           source={require('../assets/5aca6d97298b6fda48dcefe4f2ad92b5.png')}
    //           resizeMode="contain">
    //           <View style={[styles.account_wrap, styles.account_wrap_layout]}>
    //             <View style={[styles.group6, styles.group6_layout]}>
    //               <View style={[styles.rect1, styles.rect1_layout]} />
    //             </View>

    //             <View style={[styles.inbox_box1, styles.inbox_box1_layout]}>
    //               <Text style={styles.inbox1} ellipsizeMode={'clip'}>
    //                 {'Inbox'}
    //               </Text>
    //             </View>

    //             <ImageBackground
    //               style={[styles.cover_group2, styles.cover_group2_layout]}
    //               source={require('../assets/02111273b84957e8bc413c63c4cfc9a5.png')}
    //               resizeMode="contain">
    //               <View style={styles.cover_group2_space} />
    //               <View style={styles.cover_group2_col}>
    //                 <View style={[styles.rect2, styles.rect2_layout]} />
    //               </View>
    //               <View style={styles.cover_group2_space1} />
    //               <View style={styles.cover_group2_col}>
    //                 <View style={[styles.rect3, styles.rect3_layout]} />
    //               </View>
    //               <View style={styles.cover_group2_space2} />
    //               <View style={styles.cover_group2_col2}>
    //                 <View style={[styles.rect4, styles.rect4_layout]} />
    //               </View>
    //             </ImageBackground>

    //             <View style={[styles.rect5, styles.rect5_layout]} />
    //             <ImageBackground
    //               style={[styles.icon1, styles.icon1_layout]}
    //               source={require('../assets/7c703f3acc8223e816cf0ba5ad9cdaeb.png')}
    //             />
    //             <View style={[styles.dash_box, styles.dash_box_layout]}>
    //               <Text style={styles.dash} ellipsizeMode={'clip'}>
    //                 {'Dash'}
    //               </Text>
    //             </View>
    //             <View style={[styles.orders_box, styles.orders_box_layout]}>
    //               <Text style={styles.orders} ellipsizeMode={'clip'}>
    //                 {'Orders'}
    //               </Text>
    //             </View>
    //             <View style={[styles.rect6, styles.rect6_layout]} />
    //             <View style={[styles.rect7, styles.rect7_layout]} />
    //             <View style={[styles.rect8, styles.rect8_layout]} />
    //             <View style={[styles.rect9, styles.rect9_layout]} />
    //             <View style={[styles.rect10, styles.rect10_layout]} />
    //             <View style={[styles.rect11, styles.rect11_layout]} />
    //             <View style={[styles.account_box, styles.account_box_layout]}>
    //               <Text style={styles.account} ellipsizeMode={'clip'}>
    //                 {'Account'}
    //               </Text>
    //             </View>
    //           </View>
    //         </ImageBackground>
    //       </View>

    //       <View style={[styles.group7, styles.group7_layout]}>
    //         <View style={[styles.group8, styles.group8_layout]}>
    //           <View style={[styles.rect12, styles.rect12_layout]} />
    //           <View style={[styles.rect13, styles.rect13_layout]} />
    //         </View>
    //       </View>
    //     </View>
    //   </View>
    // </View>
  );
}

Geniee.inStorybook = true;
Geniee.fitScreen = false;
Geniee.scrollHeight = 812;

const styles = StyleSheet.create({
  group: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderStyle: 'solid',
    borderColor: '#f2f2f2ff',
    borderWidth: 1,
    overflow: 'hidden',
  },
  group_layout: {
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: 0,
    minHeight: 200,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  group1: {
    width: '100%',
  },
  group1_layout: {
    overflow: 'visible',
    marginTop: 13,
    marginBottom: 13,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  content_box: {
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
  },
  content_box_layout: {
    position: 'absolute',
    overflow: 'visible',
    top: 84,
    bottom: 200.5,
    left: 0,
    flexGrow: 1,
    right: 0,
  },
  content_box_space: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 33.5,
  },
  content_box_col: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 80,
  },
  text_body_box_layout: {
    marginTop: 9,
    marginBottom: 10.5,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  text_body: {
    color: '#b8b8b8ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 21,
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  text_body_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  content_box_space1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 16.5,
  },
  content_box_col1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 114,
  },
  flex: {},
  flex_layout: {
    overflow: 'visible',
    marginTop: 9,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  flex_row: {
    flexGrow: 0,
    flexShrink: 1,
  },
  notification_box_layout: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 18,
    flexGrow: 1,
    marginRight: 15,
  },
  notification: {
    color: '#3eaafdff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 21,
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  notification_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  line: {
    width: '100%',
    backgroundColor: '#3eaafdff',
  },
  line_layout: {
    marginTop: 9.5,
    height: 1,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  content_box_space2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 0.67,
  },
  content_box_col2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 130.33,
  },
  group2: {
    width: '100%',
    backgroundColor: '#ffffffff',
  },
  group2_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0.5,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 16,
  },
  annoucement_box_layout: {
    marginTop: 9,
    marginBottom: 10,
    marginLeft: 8.33,
    flexGrow: 1,
    marginRight: 9,
  },
  annoucement: {
    color: '#b8b8b8ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 21,
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  annoucement_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  group3: {
    width: '100%',
  },
  group3_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  group4: {
    width: '100%',
  },
  group4_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  flex1: {},
  flex1_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  flex1_row: {
    flexGrow: 0,
    flexShrink: 1,
  },
  flex2: {
    flexDirection: 'row',
  },
  flex2_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 32,
    flexGrow: 1,
    marginRight: 14.34,
  },
  flex2_col: {
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 32,
  },
  highlights_box_layout: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  highlights: {
    color: '#363a46ff',
    textAlign: 'center',
    letterSpacing: -0.23999999463558197,
    lineHeight: 20,
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  highlights_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  flex2_space: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 230,
  },
  flex2_col1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 17,
  },
  img: {
    resizeMode: 'contain',
  },
  img_layout: {
    marginTop: 4.67,
    height: 10.67,
    marginBottom: 4.67,
    marginLeft: 0,
    width: 17,
    minWidth: 17,
    marginRight: 0,
  },
  flex2_space1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 5,
  },
  flex2_col2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 15.33,
  },
  img_layout1: {
    marginTop: 4.33,
    height: 11,
    marginBottom: 4.67,
    marginLeft: 0,
    width: 15.33,
    minWidth: 15.33,
    marginRight: 0,
  },
  flex2_space2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 5,
  },
  flex2_col3: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 22,
  },
  cover_group: {
    width: '100%',
  },
  cover_group_layout: {
    overflow: 'visible',
    marginTop: 4.33,
    marginBottom: 4.33,
    minHeight: 11.33,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  background: {
    width: '100%',
    opacity: 0.3499999940395355,
    borderRadius: 2.6666667461395264,
    borderStyle: 'solid',
    borderColor: '#363a46ff',
    borderWidth: 1,
  },
  background_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 0,
    height: 11.33,
    marginBottom: 0,
    left: 0,
    flexGrow: 1,
    right: 0,
  },
  rect: {
    width: '100%',
    backgroundColor: '#363a46ff',
    borderRadius: 1.3333333730697632,
  },
  rect_layout: {
    marginTop: 2,
    height: 7.33,
    marginBottom: 2,
    marginLeft: 2,
    flexGrow: 1,
    marginRight: 2,
  },
  flex2_space3: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 1,
  },
  flex2_col4: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 1.33,
  },
  img_layout2: {
    marginTop: 8,
    height: 4,
    marginBottom: 8,
    marginLeft: 0,
    width: 1.33,
    minWidth: 1.33,
    marginRight: 0,
  },
  inbox_box_layout: {
    marginTop: 23,
    marginBottom: 0,
    marginLeft: 16,
    flexGrow: 1,
    marginRight: 16,
  },
  inbox: {
    color: '#363a46ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 27,
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inbox_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  line1: {
    width: '100%',
    backgroundColor: '#f8f8f8ff',
  },
  line1_layout: {
    marginTop: 13.5,
    height: 1,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  flex3: {
    flexDirection: 'row',
  },
  flex3_layout: {
    overflow: 'visible',
    marginTop: 63.5,
    marginBottom: 0,
    marginLeft: 16,
    flexGrow: 1,
    marginRight: 16,
  },
  flex3_col: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 48,
  },
  icon: {
    resizeMode: 'contain',
    borderRadius: 4,
  },
  icon_layout: {
    marginTop: 0,
    height: 48,
    marginBottom: 3,
    marginLeft: 0,
    width: 48,
    minWidth: 48,
    marginRight: 0,
  },
  flex3_space: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 16,
  },
  flex3_col1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 278,
  },
  flex_layout1: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  flex4_row: {
    flexGrow: 0,
    flexShrink: 1,
  },
  text_body_box1_layout: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  text_body1: {
    color: '#363a46ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 21,
    fontSize: 14,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  text_body_box1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  small_text_body_box_layout: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  small_text_body: {
    color: '#b8b8b8ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  small_text_body_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  small_text_bodySpan0: {
    color: '#b8b8b8ff',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  small_text_bodySpan1: {
    color: '#b8b8b8ff',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  small_text_body: {
    color: '#b8b8b8ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  small_text_body1Span0: {
    color: '#b8b8b8ff',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
  },
  small_text_body1Span1: {
    color: '#b8b8b8ff',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  small_text_body_box_layout2: {
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 80,
    flexGrow: 1,
    marginRight: 80,
  },
  small_text_body: {
    color: '#b8b8b8ff',
    textAlign: 'left',
    letterSpacing: 0,
    lineHeight: 15,
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  group5: {
    width: '100%',
    backgroundColor: '#3eaafdff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  group5_layout: {
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 532,
    marginLeft: 80,
    width: 109,
    minWidth: 109,
  },
  text_body_box_layout1: {
    marginTop: 7,
    marginBottom: 9,
    marginLeft: 15.5,
    flexGrow: 1,
    marginRight: 15.5,
  },
  text_body2: {
    color: '#ffffffff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 15.6,
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cover_group1: {
    width: '100%',
  },
  cover_group1_layout: {
    position: 'absolute',
    height: 88,
    bottom: -13,
    left: 0,
    right: 0,
  },
  account_wrap: {
    width: '100%',
  },
  account_wrap_layout: {
    overflow: 'visible',
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 28.5,
    flexGrow: 1,
    marginRight: 28.5,
  },
  group6: {
    width: '100%',
    backgroundColor: '#ffffffff',
  },
  group6_layout: {
    position: 'absolute',
    overflow: 'visible',
    top: 54,
    bottom: 0,
    left: 0,
    right: 0,
    width: 134,
    minWidth: 134,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  rect1: {
    width: '100%',
    backgroundColor: '#f8f8f8ff',
    borderRadius: 2.5,
  },
  rect1_layout: {
    marginTop: 21,
    height: 5,
    marginLeft: 0,
    width: 134,
    minWidth: 134,
  },
  inbox_box1_layout: {
    position: 'absolute',
    top: 39,
    bottom: 35,
    left: 70,
    width: 27,
    minWidth: 27,
  },
  inbox1: {
    color: '#3eaafdff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 13.5,
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  inbox_box1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cover_group2: {
    flexDirection: 'row',
  },
  cover_group2_layout: {
    position: 'absolute',
    overflow: 'visible',
    top: 12.22,
    bottom: 56.65,
    minHeight: 19.13,
    left: 73.5,
    flexGrow: 1,
    right: 73.5,
  },
  cover_group2_space: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 5.43,
  },
  cover_group2_col: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 1,
  },
  rect2: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  rect2_layout: {
    marginTop: 8.48,
    height: 2,
    marginBottom: 8.65,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  cover_group2_space1: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 3.01,
  },
  rect3: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  rect3_layout: {
    marginTop: 8.48,
    height: 2,
    marginBottom: 8.65,
    marginLeft: 0,
    flexGrow: 1,
    marginRight: 0,
  },
  cover_group2_space2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 3.01,
  },
  cover_group2_col2: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 6.56,
  },
  rect4: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  rect4_layout: {
    marginTop: 8.48,
    height: 2,
    marginBottom: 8.65,
    marginLeft: 0,
    width: 1,
    minWidth: 1,
  },
  rect5: {
    width: '100%',
    backgroundColor: '#3eaafdff',
    borderRadius: 4,
    borderStyle: 'solid',
    borderColor: '#ffffffff',
    borderWidth: 2,
  },
  rect5_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 10.3,
    height: 8,
    marginBottom: 69.7,
    left: 87.5,
    width: 8,
    minWidth: 8,
  },
  icon1: {
    resizeMode: 'contain',
  },
  icon1_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 10.3,
    height: 22.96,
    marginBottom: 54.74,
    left: 7.5,
    width: 24,
    minWidth: 24,
  },
  dash_box_layout: {
    position: 'absolute',
    top: 38,
    bottom: 36,
    left: 7,
    width: 25,
    minWidth: 25,
  },
  dash: {
    color: '#919096ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 13.5,
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  dash_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  orders_box_layout: {
    position: 'absolute',
    top: 38,
    bottom: 36,
    width: 32,
    minWidth: 32,
    right: 67.5,
  },
  orders: {
    color: '#919096ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 13.5,
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  orders_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rect6: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect6_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 18,
    height: 2,
    marginBottom: 68,
    width: 13,
    minWidth: 13,
    right: 74.5,
  },
  rect7: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect7_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 24,
    height: 2,
    marginBottom: 62,
    width: 13,
    minWidth: 13,
    right: 74.5,
  },
  rect8: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect8_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 30,
    height: 2,
    marginBottom: 56,
    width: 13,
    minWidth: 13,
    right: 74.5,
  },
  rect9: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect9_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 18,
    height: 2,
    marginBottom: 68,
    width: 0.01,
    minWidth: 0.01,
    right: 92.49,
  },
  rect10: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect10_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 24,
    height: 2,
    marginBottom: 62,
    width: 0.01,
    minWidth: 0.01,
    right: 92.49,
  },
  rect11: {
    width: '100%',
    backgroundColor: '#919096ff',
    borderRadius: 1,
  },
  rect11_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 30,
    height: 2,
    marginBottom: 56,
    width: 0.01,
    minWidth: 0.01,
    right: 92.49,
  },
  account_box_layout: {
    marginTop: 39,
    marginBottom: 35,
    marginLeft: 'auto',
    width: 39,
    minWidth: 39,
    marginRight: 0,
  },
  account: {
    color: '#b8b8b8ff',
    textAlign: 'center',
    letterSpacing: 0,
    lineHeight: 13.5,
    fontSize: 9,
    fontWeight: '700',
    fontStyle: 'normal',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  account_box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  group7: {
    width: '100%',
    backgroundColor: '#3eaafdff',
    borderRadius: 28,
  },
  group7_layout: {
    position: 'absolute',
    overflow: 'visible',
    top: 699,
    bottom: 31,
    left: 0,
    right: 0,
    width: 56,
    minWidth: 56,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  group8: {
    width: '100%',
  },
  group8_layout: {
    overflow: 'visible',
    marginTop: 19,
    marginBottom: 19,
    width: 20,
    minWidth: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  rect12: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  rect12_layout: {
    position: 'absolute',
    top: 0,
    marginTop: 0,
    height: 18,
    marginBottom: 0,
    width: 2,
    minWidth: 2,
    right: 8,
  },
  rect13: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 1,
  },
  rect13_layout: {
    marginTop: 8,
    height: 2,
    marginBottom: 8,
    marginLeft: 2,
    flexGrow: 1,
    marginRight: 0,
  },
});
