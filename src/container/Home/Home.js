import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
  FlatList,
  Share,
  Modal,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { postAPI } from '../../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './Styles';
import { Swipeable } from 'react-native-gesture-handler';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getPoperties } from '../../modules/getPoperties';
import { getRating } from '../../modules/getRating';
import { postRating } from '../../modules/postRating';
import { getSearch } from '../../modules/getSearch';
import { getFilter } from '../../modules/getFilter';
import { getNearBy } from '../../modules/getNearBy';
import { SvgUri } from 'react-native-svg';
import { Rating, AirbnbRating } from 'react-native-ratings';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import { create } from 'apisauce';

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const [homeData, setHomeData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPopertiesApiCall();
    getFilterApiCall();
  }, []);
  const getFilterApiCall = () => {
    dispatch(getFilter()).then(response => {
      console.log('res', response.payload);
      setFilterData(response.payload.data);
    });
  };
  const getPopertiesApiCall = () => {
    dispatch(getPoperties()).then(response => {
      console.log('res', response.payload);
      setHomeData(response.payload.data);
    });
  };
  const getNearByApiCall = () => {
    setLoading(true);
    dispatch(getNearBy()).then(response => {
      console.log('res', response.payload.data);
      setHomeData(response.payload.data);
    }).
      finally(() => {
        setLoading(false);
      });
  };
  const getSearchApiCall = () => {
    dispatch(getSearch(adress)).then(response => {
      console.log('res', response.payload);
      setHomeData(response.payload.data);
    });
  };
  const handleSlideChange = event => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / slideWidth);
    setCurrentSlide(index);
  };

  const scrollToIndex = index => {
    setIndex(index);
    flatListRef.current.scrollToIndex({ index });
  };


  const handleSwipeFromLeft = id => {
    //Vibration.vibrate(100);
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleSwipeFromRight = id => {
    //Vibration.vibrate(100);
    setData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return { ...item, liked: true };
        }
        return item;
      }),
    );
  };


  const onDone = () => {
    navigation.navigate('Tabs', { screen: 'Home' });
  };

  const renderFillterItem = ({ item }) => (
    // console.log('cheker', item.term_icon_url),
    <View style={{ justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => { }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
          }}>
          {/* <Image source={{uri: item.term_icon_url}} /> */}
          <SvgUri
            style={{ height: 20, width: 20, resizeMode: 'contain' }}
            uri={item.term_icon_url}
          />
          <Text
            style={{ fontSize: 12, color: Colors.black, marginTop: 5, fontWeight: '700' }}>
            {item.term_name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={Platform.OS == 'android' ? styles.container : styles.containerIos}>
      <View
        style={{
          height: Platform.OS == 'android' ? '12%' : '8%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            height: 40,
            width: '75%',
            borderRadius: 18,
            borderWidth: 1,
            borderColor: Colors.BorderColor,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => getSearchApiCall()}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.search}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                marginLeft: 10,
              }}></Image>
          </TouchableOpacity>
          <View style={Styles.phoneInputView}>
            <TextInput
              allowFontScaling={false}
              style={Styles.inputStyle}
              placeholderTextColor={Colors.textColorLight}
              placeholder={'Search...'}
              returnKeyType="done"
              onChangeText={text => setAddres(text)}
            />
          </View>
          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftWidth: 1,
              borderLeftColor: Colors.BorderColor,
            }}>
            <Image
              source={Images.address}
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
              }}></Image>
          </TouchableOpacity>
        </View>
        <View>
          {loading ? (
            <ActivityIndicator size="small" color="blue" />
          ) : (

            <TouchableOpacity
              onPress={() => getNearByApiCall()}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.gps}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}></Image>

            </TouchableOpacity>

          )}
        </View>
      </View>
      <View style={{ width: '95%', alignSelf: 'center', height: '8%' }}>
        <FlatList
          data={filterData}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleSlideChange}
          onMomentumScrollEnd={handleSlideChange}
          renderItem={renderFillterItem}
        />
      </View>
      <View style={{ height: Platform.OS == 'android' ? '74%' : '84%' }}>
        <AppIntroSlider
          renderItem={({ item }) => <Item item={item} />}
          showNextButton={false}
          showPrevButton={false}
          showDoneButton={false}
          data={homeData}
          pagingEnabled={true}
          bottomButton={false}
          activeDotStyle={{ position: 'absolute' }}
          dotStyle={{ position: 'absolute' }}
        //dotStyle={Colors.white}
        //activeDotStyle={Colors.white}
        // onDone={onDone}
        //scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};
const Item = ({ item, onSwipeFromLeft, onSwipeFromRight }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const [rating, setRating] = useState(0);
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [review, setReview] = useState('');
  const [text, setText] = useState('')

  const dispatch = useDispatch();
  useEffect(() => {
    getRatingApiCall();
  }, []);
  const getRatingApiCall = () => {
    dispatch(getRating()).then(response => {
      console.log('rating Response', response.payload);
      setRating(response.payload.data[0]?.photo_wuality_rating);
      setRating(response.payload.data[0]?.description_review_stars);
      setRating(response.payload.data[0]?.price_review_stars);
      setRating(response.payload.data[0]?.interest_review_stars);
    });
  };


  const renderNextButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -150,
          zIndex: 99,
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: Colors.white,
            transform: [{ rotate: '-90deg' }],
          }}
          source={Images.downArrow}></Image>
      </View>
    );
  };

  const renderPrevButton = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          position: 'absolute',
          top: -40,
          left: -180,
          zIndex: 99,
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: Colors.white,
            transform: [{ rotate: '90deg' }],
          }}
          source={Images.downArrow}></Image>
      </View>
    );
  };

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    var formdata = new FormData();
    formdata.append('userID', id);
    formdata.append('postid', productId);
    formdata.append('photo_quality_rating', rating1);
    formdata.append('desc_stars', rating2);
    formdata.append('price_stars', rating3);
    formdata.append('interest_stars', rating4);
    formdata.append('content', review);
    formdata.append('reviewtitle', reviewTitle);

    console.log(formdata);

    dispatch(postRating(formdata)).then(response => {
      console.log('res', response.payload);
      if (response.payload.success) {
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });
  };

  const saveFile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('userID', userID);
    data.append('post_id', post_id);
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/favorites/addremovefavorite.php',
        data,
      );

      console.log('--ppp', res);
      // console.log('--ppp', typeof res.status);

      if (res.status == 200) {
        Alert.alert(res.data.message);
      } else {
        Alert.alert('something went wrong!.');
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('userID', userID);
    data.append('post_id', post_id);
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/trashlist/addremovetrash.php',
        data,
      );

      console.log('--ppp', res.data);

      if (res.status == 200) {
        console.log('--ppp', res.data);
        Alert.alert(res.data.message);
      } else {
        Alert.alert('something went wrong!.');
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const shareContent = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome app!',
        url: 'https://example.com',
        title: 'My RN App',
      });
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share operation dismissed');
      }
    } catch (error) {
      console.log(`Error sharing content: ${error.message}`);
    }
  };

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <TouchableOpacity
        style={{
          width: screenWidth,
          height: Platform.OS == 'android' ? '45%' : '30%',
          marginTop: Platform.OS == 'android' ? 40 : 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('ViewPropertiy', { data: item })}>
        <Image
          source={{ uri: item.featured_image_src }}
          style={styles.slide}></Image>
        <AppIntroSlider
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.guid }} style={styles.slide}></Image>
            </View>
          )}
          showNextButton={false}
          renderNextButton={renderNextButton}
          renderPrevButton={renderPrevButton}
          showPrevButton={false}
          data={item.property_gallery}
          dotStyle={Colors.white}
          showDoneButton={false}
          activeDotStyle={Colors.white}
          // onDone={onDone}
          scrollEnabled={false}
        />
      </TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          width: '90%',
          height: '10%',
          marginTop: Platform.OS == 'android' ? 40 : 0,
          marginRight: 20,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',

        }}>
          <TouchableOpacity
            onPress={() => {
              setProductId(item.ID);
              toggleModal();
            }}>

            <Image
              source={Images.star}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, color: Colors.black, textAlign: 'center', marginLeft: 5 }}>
            {item.total_average_rating}
          </Text>
        </View>

        <TouchableOpacity
          style={{ alignSelf: 'center' }}
          onPress={() => { }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.primaryBlue,
              fontWeight: '500',
            }}>
            {item.originallistprice}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => shareContent()}>
          <Image
            source={Images.send}
            style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
        </TouchableOpacity>
      </View>
      <View >

        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={toggleModal}>
          <View
            style={{
              // marginTop: 40,
              height: '80%',
              width: '100%',
              alignItems: 'center',
              alignContent: 'center',
              backgroundColor: Colors.white,
              position: 'absolute',
              bottom: 10,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 1,
              borderColor: Colors.gray,
            }}>
            <View
              style={{
                height: '10%',
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 10,
                }}>
                <Text style={{ fontSize: 12, color: Colors.gray }}></Text>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                  // height:"50%"
                }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    height: 5,
                    width: 50,
                    borderRadius: 8,
                    backgroundColor: Colors.gray,
                  }}></TouchableOpacity>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: Colors.black,
                    marginTop: 10,
                  }}>
                  Rate and Review
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Image
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    tintColor: Colors.black,
                    transform: [{ rotate: '45deg' }],
                  }}
                  source={Images.plus}></Image>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: Colors.gray,
                marginTop: 10,
                justifyContent: 'center',
              }}></View>
            <View style={{ width: '95%', height: '70%' }}>
              <View style={{ width: '95%', alignSelf: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Text style={{ fontSize: 12, color: Colors.black, }}>
                    Photos Quality Rating :
                  </Text>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={25}
                    startingValue={rating}
                    ratingBackgroundColor="#c8c7c8"
                    onFinishRating={setRating}
                    style={styles.rating}
                    ratingColor="#ffbe0b"
                  //tintColor="#f1f3f4"
                  />
                </View>
              </View>

              <View style={{ width: '95%', alignSelf: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 12, color: Colors.black }}>
                    Description & Details :
                  </Text>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={25}
                    startingValue={rating}
                    ratingBackgroundColor="#c8c7c8"
                    onFinishRating={setRating}
                    style={styles.rating}
                    ratingColor="#ffbe0b"
                  //tintColor="#f1f3f4"
                  />
                </View>
              </View>
              <View style={{ width: '95%', alignSelf: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 12, color: Colors.black }}>
                    Price Of Property :
                  </Text>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={25}
                    startingValue={rating}
                    ratingBackgroundColor="#c8c7c8"
                    onFinishRating={setRating}
                    style={styles.rating}
                    ratingColor="#ffbe0b"
                  //tintColor="#f1f3f4"
                  />
                </View>
              </View>

              <View style={{ width: '95%', alignSelf: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ fontSize: 12, color: Colors.black }}>
                    General Interest in the property :
                  </Text>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={25}
                    startingValue={rating}
                    ratingBackgroundColor="#c8c7c8"
                    onFinishRating={setRating}
                    style={styles.rating}
                    ratingColor="#ffbe0b"
                  //tintColor="#f1f3f4"
                  />
                </View>
              </View>


              <View style={{ height: 20 }}></View>
              <View style={{ width: '95%', alignSelf: 'center' }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.black,
                    marginTop: 12,
                  }}>
                  Review
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: 100,
                    marginTop: 10,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    allowFontScaling={false}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      height: '100%',
                      paddingHorizontal: 12,
                      color: Colors.black,
                      borderWidth: 1,
                      borderColor: Colors.gray,
                      fontSize: 14,
                      padding: 2,
                    }}
                    keyboardType="default"
                    autoCorrect={false}
                    returnKeyType="done"
                    placeholderTextColor={Colors.gray}
                    placeholder='Write a review...'
                  //onChangeText={text => setMobile(text)}
                  />
                </View>
              </View>
              <View style={{

                width: '100%',

                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "flex-end",
                paddingHorizontal: 10
              }}>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    height: 35,
                    width: '45%',
                    borderRadius: 5,
                    backgroundColor: Colors.PrimaryColor,
                    marginTop: 10,


                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "center"

                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                      color: Colors.white,
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      <View
        style={{
          height: '10%',
          justifyContent: 'space-between',
        }}>

        <TouchableOpacity
          onPress={() => { }}
          style={{ width: '98%', alignSelf: 'center', justifyContent: 'center' }}>
          <Text
            style={{ fontSize: 16, color: Colors.black, textAlign: 'center' }}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>


      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          height: '20%',
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        {item.property_bedrooms != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bed}
              style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_bedrooms} {'Beds'}
            </Text>
          </View>
        ) : null}
        {item.bathroomsfull != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.bath}
              style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.bathroomsfull} {'Baths'}
            </Text>
          </View>
        ) : null}
        {item.property_size != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.measuring}
              style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {item.property_size}{'sq ft'}
            </Text>
          </View>
        ) : null}
        {item.associationfee != '' ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <Text
              style={{
                fontSize: 20,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {"HOA"}
            </Text>
            {/* <Image
              source={Images.hoa}
              style={{height: 25, width: 25, resizeMode: 'contain'}}></Image> */}
            <Text
              style={{
                fontSize: 16,
                color: Colors.black,
                textAlign: 'center',
              }}>
              {'$'}{item.associationfee == null ? 0 : item.associationfee}
            </Text>
          </View>
        ) : null}
      </View>

      <View
        style={{
          width: '90%',
          height: Platform.OS == 'android' ? '15%' : '30%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 99,
          overflow: 'visible',
        }}>
        <TouchableOpacity onPress={() => trashfile(item.ID)}>
          <Image
            source={Images.dislike}
            style={{ height: 40, width: 40 }}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => saveFile(item.ID)}>
          <Image source={Images.like} style={{ height: 40, width: 40 }}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  containerIos: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth - 20,
    height: 300,
    marginTop: 10,
    borderRadius: 18,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  //fliter
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Home;