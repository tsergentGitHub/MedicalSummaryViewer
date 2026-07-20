import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
// You can import supported modules from npm
import { Card } from 'react-native-paper';
// or any files within the Snack
import AssetExample from './components/AssetExample';
// This is a simple application to load synopsi of medical conditions from various websites directly into
// the app. The basic goal is to provide summaries of conditions, with different explanations, and to have them
// displayed. Later, functionality may be added to load full webpages as a browser open from the app and to 
// save conditions into a My Followed Conditions folder. 

// Many users tend to rely on Google AI to provide condition information. This app is to be used to quickly,
// and directly, reference information about them from other trusted sources. 
// @Author Travis Sergent

// Educational References: 
// https://dev.to/paulallies/creating-a-responsive-side-navigation-bar-with-html-css-and-javascript-3538
 // https://www.w3schools.com/howto/howto_js_sidenav.asp
 // https://www.google.com/search?q=api+fetch+javascript&rlz=1C1AWFC_enUS1110US1110&oq=api+fetch+javascript&gs_lcrp=EgZjaHJvbWUqBwgAEAAYgAQyBwgAEAAYgAQyCAgBEAAYFhgeMggIAhAAGBYYHjIICAMQABgWGB4yCAgEEAAYFhgeMggIBRAAGBYYHjIICAYQABgWGB4yCAgHEAAYFhgeMggICBAAGBYYHjIICAkQABgWGB7SAQgyMTEzajBqNKgCALACAQ&sourceid=chrome&ie=UTF-8
 // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString
// https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName
// https://www.robinwieruch.de/react-state-array-add-update-remove/


/* Referenced to help understand the necessity of having ScrollView contained within SafeAreaView to
work/show within the Web app, when nested within SafeAreaProvider*/
//https://reactnative.dev/docs/scrollview

/* Explains how SafeAreaProvider ensures apps have flex boundary areas so they show appropriately within apps*/
// https://docs.expo.dev/versions/latest/sdk/safe-area-context/

// API Tools/References:
// https://tools.cdc.gov/api/docs/info.aspx#search_media

// Platform Specific Handling:
// https://reactnative.dev/docs/platform-specific-code

// Text Area inside ScrollView Information
// https://reactnative.dev/docs/scrollview



var TextBody = 'Updated Info Here'; 
export default class App extends Component {

  state = {
    TextBody: "Updated Info here.",
    hiddenState: false,
    summaryInfo: "Placeholder",

  }
  render(){
    return(
      <SafeAreaProvider id="sidenav" style={styles.sidenav}>


      <Button onPress={() => this.toggleSidenav()}><Text>Toggle</Text> </Button>


            
              {/*Sidebar elements have toggled visibility tied to hiddenState attribute.*/}
              {this.state.hiddenState && <View><Text>Home</Text></View>}
              {this.state.hiddenState && <View><Text>Search</Text></View>}
              {this.state.hiddenState && <TouchableOpacity style={styles.dropdownButton} onPress={() => this.clearFetchRequest()}><Text>Clear Results</Text> </TouchableOpacity>}

      <Text> Data fetched from cdc.gov </Text>
      <Text>{this.state.TextBody} </Text>
      <Button onPress={() => this.fetch()}><Text>Fetch</Text> </Button>
      <SafeAreaProvider style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="automatic"><Text>{this.state.summaryInfo}</Text>
        </ScrollView>
      </SafeAreaProvider>
    </SafeAreaProvider>
    );
  }
   toggleSidenav() {
    //this.state.TextBody = "DSFSDF"
    this.setState({TextBody: "DSDFDS"})
    this.setState({hiddenState: !this.state.hiddenState})

    //if (this.state.hiddenState == false) {
    //    document.getElementById("sidenav").style.display = "block";
    //    document.getElementById("sidenav").setState({isHidden})
   // } else {
   //   document.getElementById("sidenav").style.display = "none";
   //}
  }

  // Fetch an API. For initial testing, standard URL with input. Later, to take actual search input and with variable site selecting.
  async fetch(){
    // To find condition
  //const url = "https://tools.cdc.gov/api/v2/resources/media?q=diabetes";
  //const url = "https://jsonplaceholder.typicode.com/users/1";
  //const url = "https://tools.cdc.gov/api/v2/resources/tags/16/media";
  const url = "https://www.cdc.gov/autism/signs-symptoms/index.html";
  //const url = "https://www.google.com";



    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Run iOS-specific code
      
      this.setState({summaryInfo: "iOS or Android Branch Success"});
      console.log("Here");
    }

    // Code to fetch information if on PC/Other Device.
    else{
          try {
            const response = await fetch(url);
            
            // Always check if the response status is 200-299
            if (!response.ok) {
              throw new Error(`HTTP Error Status: ${response.status}`);
            }
        // All this doesnt' seem to wrork
        //const data = await response.json(); // Parses JSON response body
        //console.log(data);
      // responseParsed = response.text();
        const parser = new DOMParser();
      // const document = parser.parseFromString(responseParsed, 'text/html');
        //console.log(document.documentElement.textContent)
      // console.log(document);
      // console.log(response.text());
      // response.text();
      // const pageElements = document.querySelectorAll('h1')
      // pageElements.forEach(element => {
      //   console.log(element.textContent); // Extracts text from the tag
        //  })

        fetch('https://www.cdc.gov/autism/signs-symptoms/index.html')
        .then(response => response.text())
        .then(html => {
          // Parse the HTML here
              const doc = parser.parseFromString(html, 'text/html');
              //const data = doc.getElementsByClassName('dfe-section');
              const data = doc.getElementsByClassName('level-1');
              // Clears Info 
              var displayData = "";
              this.setState({ summaryInfo: ""});
              for (var i = 0; i < data.length; i++) {
                console.log("length = " + data.length)
                  console.log(data[i].textContent);
                  const arrayTemp = this.state.summaryInfo;
                  //console.log({summaryInfo});
                  //console.table(arrayTemp);
                  //arrayTemp.concat(["DF"])
                  //console.log(this.getState({summaryInfo}));

                  // Set at start of bullet points a bullet point in content?
                  //if(){
                  //  this.setState({summaryInfo: [(data[i].textContent).concat("\n")]});
                  //}
                  //this.setState({summaryInfo: (arrayTemp.concat(data[i].textContent).concat("\n"))});
                  displayData = displayData.concat(data[i].textContent).concat("\u2022").concat("\n");
              }
              this.setState({summaryInfo: displayData});
              //displayData = "";
              console.log(data);
         })


      this.setState({TextBody: "HDF"})
      
      //this.setState({TextBody: JSON.stringify(data)})
    } 
    catch (error) {
      console.error("Fetch failed:", error); // Catches network errors
      this.setState({TextBody: "Data couldn't be obtained succesfully."})
    }

    }


  }



  /* Clears the Fetch Request Results on the Screen.*/
  clearFetchRequest(){

    this.setState({TextBody: ""});
    this.setState({summaryInfo: ""});
  }
}






//
// Style Contents
//
const styles = StyleSheet.create({
  // Fix this alignSelf, alignItems, whatever to make fit screen size
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
    width: '100%'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sidenav: {
    width: 350,
    height: 100,
    backgroundColor: 333,
    paddingTop: 65,
    color: '#fff',
      gap: 10,
      padding: 10,
      //span {
      //  transition: opacity 0.3s ease-in-out;
      //}
      alignSelf: 'center'

    
  },
    scrollView: {
    height: 50, // Set a fixed height
    width: '100%', // Set a fixed width
    //flex: 1,
    flexGrow: 1
  },

  // Dropdown bar button style
  dropdownButton: {
      padding: 10 ,
      fontSize: 50,
      borderRadius: 3,
      marginTop: 10,
      backgroundColor: 'lightgrey',
      alignSelf: 'left',
      width: '50%'
  }


  
});

const Button = styled.TouchableOpacity(
 { padding: 10 },
 {fontSize: 50},
 {borderRadius: 3},
 {marginTop: 10},
 props => ({backgroundColor: 'cyan'}),
  
);






