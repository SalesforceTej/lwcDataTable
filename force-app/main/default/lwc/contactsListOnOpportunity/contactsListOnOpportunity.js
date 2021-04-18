
import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { getRecord } from 'lightning/uiRecordApi';


//Import the Apex method to get the all Contacts
import getAllContacts from "@salesforce/apex/ContactsListOnOpportunityController.getContactData";

const columns = [
    { label: "Name", fieldName: "Name" },
    { label: "Email", fieldName: "Email", type: "email" },
    { label: "Phone", fieldName: "Phone", type: "phone" },
    { label: "Title", fieldName: "Title", type:"text"},
  ];

  export default class ContactsListOnOpportunity extends LightningElement {

@api recordId;
@track accountId;

@track isPrivate;

columns = columns;

@track selectedContacts = [];
@api totalNumberOfRows = 100;
@track _showSelectedContactList=false;

@track isModalOpen = true;
@track _showDefaultContactList = true;
@track _showBackButton = false;

error;
@track selection = [];
@track selectedRows = [];
@track totalConactsCount;
@track totalListOfContacts;
@track contactsData = [];
@track selectedContactsData = [];
// load more variables
@track loadMoreStatus;
rowLimit = 10;
rowOffSet = 0;
//toast variables 
@track toastTitle;
@track toastMessage;
@track toastVariant;


async connectedCallback() {
    console.log('@@@ Opp Id +'+this.recordId);
    this.getContactsData();
    this.isLoaded = true;
  }
  //Call apex method 
  getContactsData(){
    return getAllContacts({
       
       // pass the data as a paramaters
       oppId : this.recordId,
       offSetCount: this.rowOffSet,
       limitSize: this.rowLimit
    })
    .then((result) => {
       // alert('@@ in get contacts');
        console.log("@@@@@ result1" + JSON.stringify(result));
        let updatedRecords = [...this.contactsData, ...result.contactList];
        //var contactsData = result;
        this.contactsData = updatedRecords;
       this.totalListOfContacts = result.totalContactsCount;
    })
    .catch((error) =>{
         // this.isLoaded = false;
         console.log("Encountered error : " + JSON.stringify(error));
         this.error = JSON.stringify(error);
    });
  }

  // load more funcation 
  loadMoreData(event) {
   // alert('@@@ in loadmore ');
    //Display "Loading" when more data is being loaded
    this.loadMoreStatus = "Loading";
    const { target } = event;
    target.isLoading = true;
    this.rowOffSet = this.rowOffSet + this.rowLimit;
    let localcount = this.contactsData.length;
    console.log("@@@@localcount " + localcount);
    console.log("@@@totalConactsCount" + this.totalListOfContacts);
    this.loadMoreStatus = '';
    if (localcount == this.totalListOfContacts) {
      event.target.enableInfiniteLoading = false;
      target.isLoading = false;
    } else {
      this.getContactsData()
        .then(() => {
          target.isLoading = false;
        })
        .catch((error) => {
          // this.isLoaded = false;
          console.log("Encountered error : " + JSON.stringify(error));
          this.error = JSON.stringify(error);
        });
    }
  }

  //handle all the selections 
  rowSelection(event) {
    const selectedRow = event.detail.selectedRows;
    console.log('@@@ event.detail.selectedRows'+event.detail.selectedRows);
    this.selectedContactsData = event.detail.selectedRows;
    this.template.querySelector('[data-id="selectedButton"]').classList.remove('slds-hide');
  }

  handleShowSelectedButton(){
    this._showSelectedContactList = true;
    this._showDefaultContactList = false;
    this._showBackButton = true;
    this.template.querySelector('[data-id="selectedButton"]').classList.add('slds-hide');
     
  }

  closeModal() {
    // to close modal set
    this.dispatchEvent(new CustomEvent("close"));
  }

  //handle back button 
  handleBackButton(){
    this._showSelectedContactList = false;
    this._showDefaultContactList = true;
    this._showBackButton = false;
    this.template.querySelector('[data-id="selectedButton"]').classList.add('slds-hide');
  }
}