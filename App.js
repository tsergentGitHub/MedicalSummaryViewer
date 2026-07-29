import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import React, { Component, useState } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, Alert, Keyboard } from 'react-native';
// You can import supported modules from npm
import { Card } from 'react-native-paper';
// or any files within the Snack
import AssetExample from './components/AssetExample';
import JSSoup from 'jssoup';
import axios from 'axios';

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

// JSSoup Documentation (NOTE: The need for Axios to make the URL request)
// https://www.npmjs.com/package/jssoup

// TextInput documentation
// https://reactnative.dev/docs/textinput

var TextBody = 'Updated Info Here'; 
export default class App extends Component {

  state = {
    TextBody: "Updated Info here.",
    hiddenState: false,
    summaryInfo: "",
    //textInput: "",
    //[textInput, setText] = useState('')
    //textInput: setText
    textInput: "meep",
    updateInput: "tobeupdated",
    textTitle: ""

  }
  //const [text, setText] = useState('');
  
  // Method that is updated from the TextInput changes
   handleText = (text) => {
    //setName(text);
  
    this.setState({updateInput: text})
  };

  // This method is called when the TextInput of the GUI has the enter key pressed.
    enterSubmit = () => {
        this.fetch();
    };

  render(){
    return(
      <SafeAreaProvider id="sidenav" style={styles.sidenav}>


      <Button onPress={() => this.toggleSidenav()}><Text>Toggle</Text> </Button>


            
              {/*Sidebar elements have toggled visibility tied to hiddenState attribute.*/}
              {this.state.hiddenState && <View><Text>Home</Text></View>}
              {this.state.hiddenState && <View><Text>Search</Text></View>}
              {this.state.hiddenState && <TouchableOpacity style={styles.dropdownButton} onPress={() => this.clearFetchRequest()}><Text>Clear Results</Text> </TouchableOpacity>}
      
      <Text style= {styles.condition}>{this.state.textTitle} </Text>
      <Text> Data fetched from cdc.gov </Text>
      
      <TextInput style = {styles.textInput} id="test" value = {this.state.updateInput} onChangeText={this.handleText} onSubmitEditing={this.enterSubmit} />
      <Button onPress={() => this.fetch()}><Text>Fetch</Text> </Button>
      <SafeAreaProvider style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="automatic"><Text>{this.state.summaryInfo}</Text>
        </ScrollView>
      </SafeAreaProvider>
    </SafeAreaProvider>
    );
  }
   toggleSidenav() {
    this.setState({TextBody: "SideBarOpened"})
    this.setState({hiddenState: !this.state.hiddenState})

  }

  // Fetch an API. For initial testing, standard URL with input. Later, to take actual search input and with variable site selecting.
  // To search for textInput that is input into the TextField
  async fetch(){
    // To find condition
  //const url = "https://tools.cdc.gov/api/v2/resources/media?q=diabetes";
  //const url = "https://jsonplaceholder.typicode.com/users/1";
  //const url = "https://tools.cdc.gov/api/v2/resources/tags/16/media";
  // USEFUL TESTER
  //var url = "https://www.cdc.gov/autism/signs-symptoms/index.html";
  //const url = "https://www.google.com";

  //const axios = require('axios');

  var textInputStringified = this.state.updateInput;
  // replaces spaces with dashes to assist in URL fetches
  textInputStringified = textInputStringified.replace(/\s+/g, '-');
  console.log(textInputStringified);
  var url = "https://www.cdc.gov/"+textInputStringified+"/signs-symptoms/index.html";

  const JSSoup = require('jssoup').default;

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      // Run iOS and Android specific code
      
      this.setState({summaryInfo: "Loading..."});
      console.log("Loading");
      
      
      //var url = 'https://www.cdc.gov/autism/signs-symptoms/index.html';
    
      try {
        // 1. Fetch the raw HTML text using axios
        const response = await axios.get(url);
        const htmlContent = response.data;

        // 2. Parse it into a JSSoup object
        const soup = new JSSoup(htmlContent);

        // 3. Output the full HTML string
        console.log(soup.toString());

        // JSSoup gets tags "li" with class name of "level-1"
        var content = soup.findAll("li", {class: 'level-1'});


        var displayData = "";
        // Iterates through returned web tags and gets the text content
        for (var i = 0; i < content.length; i++) {
          console.log(content[i].text)
      
          displayData = displayData.concat(content[i].text).concat("\n").concat("\u2022");
           
        }

        this.setState({summaryInfo: displayData});
        
    } catch (error) {
        console.error('Error fetching website:', error);
        this.setState({TextBody: "Data couldn't be obtained succesfully."})
        this.setState({summaryInfo: "Could not display content for this search."});
    }

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

        textInputStringified = this.state.updateInput;
        // replaces spaces with dashes to assist in URL fetches
        textInputStringified = textInputStringified.replace(/\s+/g, '-');
        console.log(textInputStringified);
        url = "https://www.cdc.gov/"+textInputStringified+"/signs-symptoms/index.html";

        fetch(url)
        .then(response => response.text())
        .then(html => {
          // Parse the HTML here
              const doc = parser.parseFromString(html, 'text/html');
              //const data = doc.getElementsByClassName('dfe-section');
              const data = doc.getElementsByClassName('level-1');

              // Clears Info 
              var displayData = "";
              this.setState({ summaryInfo: ""});
              // Saves the symptom content into the displayData section of the app.
              for (var i = 0; i < data.length; i++) {
                console.log("length = " + data.length)
                  console.log(data[i].textContent);
                  const arrayTemp = this.state.summaryInfo;

                  displayData = displayData.concat(data[i].textContent).concat("\n").concat("\u2022");
              }
              // Removes final bullet point
              displayData = displayData.slice(0, -1);
              this.setState({summaryInfo: displayData});

              // Parses the symptom data title from the CDC page and saves into the textTitle section of the app
              const symptomTitleData = doc.getElementsByClassName('cdc-page-title cdc-page-offset syndicate');
              var titleData = "";
              titleData = symptomTitleData[0].textContent.trim();
              this.setState({textTitle: titleData});
              //displayData = "";
              console.log(data);
         })


      this.setState({TextBody: "HDF"})

    } 
    catch (error) {
      console.error("Fetch failed:", error); // Catches network errors
      this.setState({TextBody: "Data couldn't be obtained succesfully."})
      this.setState({summaryInfo: "Could not display content for this search."});
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
  },

    textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  // Condition name style
  condition:{
    fontSize: 25
  }


  
});

const Button = styled.TouchableOpacity(
 { padding: 10 },
 {fontSize: 50},
 {borderRadius: 3},
 {marginTop: 10},
 props => ({backgroundColor: 'cyan'}),
  
);






