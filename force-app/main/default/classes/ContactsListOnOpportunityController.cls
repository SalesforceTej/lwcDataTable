
/*****************************
 * @author : SalesforceTej
 * @description : This class will return all the contacts associated to an Account. 
 * @param : accountId
 * 
 ***************************/

public inherited sharing class ContactsListOnOpportunityController {
    //integer to store the total contacts count. 
    public static integer totalContactsCount;

    @AuraEnabled(cacheable=false)
    public static contactWrapperObject getContactData(string oppId, integer offSetCount, integer limitSize ) {

        List<Contact> lstOfContacts = new  List<Contact>();
        List<Contact> totalContactsCountList = new List<Contact>();
        // Query AccountId from Opportunity. 
        Opportunity oppObj = [Select Id, Name, AccountId from Opportunity where Id =: oppId ];
        if(oppObj.AccountId !=null){
             //Query the contacts and store it in a list
         lstOfContacts = [SELECT Id, Name, Title, Email, Phone, LeadSource 
                          FROM Contact 
                          WHERE AccountId = :oppObj.AccountId   
                          ORDER BY CreatedDate ASC 
                          LIMIT  : limitSize 
                          OFFSET : offSetCount]; 
         // get the total conatcts count                  
        totalContactsCountList = [Select id from contact where accountId = :oppObj.AccountId ];
        totalContactsCount = totalContactsCountList.size();  
        }
       
       
        //Build the wapper object
        contactWrapperObject wapperObj = new contactWrapperObject(null,null);
        wapperObj.contactList = lstOfContacts;
        wapperObj.totalContactsCount = totalContactsCount;

        return wapperObj;
    }

    //wrapper class to store contact List and total contacts count
    public class contactWrapperObject{
        @AuraEnabled public List<Contact> contactList{get;set;}
        @AuraEnabled public integer totalContactsCount{get;set;}

        public contactWrapperObject(List<Contact> contactList, integer totalContactsCount){
            this.contactList = contactList;
            this.totalContactsCount = totalContactsCount;
        }
    }
}

