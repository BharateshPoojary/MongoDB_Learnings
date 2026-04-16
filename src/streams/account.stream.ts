import { ChangeStreamOptions } from "mongodb";
import { accountModel } from "../models/account.model";

const startAccountChangeStream = () => {
  const pipleine: Array<Record<string, unknown>> = [
    {
      $match: {
        operationType: "update",//By specifying the operation type it allow us to filter the action which is performed on collection at databae level or else we have to filter the event which is required by us at teh callback of the on change of the collection 
      },
    },
  ];
const options:ChangeStreamOptions = {//$changeStream stage  only works when you are using mongodb Driver directly , for mongoose we have to pass it as options in watch method
  fullDocument: "updateLookup",//This property allow us to get the full document when the update occurs instaed of getting only the updated fields 
};  
  const changeStream = accountModel.watch(pipleine, options);//This method watches for the underlying changes in the collection and allow us to do some specific task which is required when particular operation takes place e.g when the order is placed an email must be sent to customer that kind of event based task could be done with the help of watch method as it continuously streams for any event in the collection 
  changeStream.on("change", (change) => {
    console.log("Change detected in account collection:", change);
    const updatedFields = change.updateDescription?.updatedFields;
    const fullDocument = change.fullDocument;
    console.log("Account updated:", {
      accountId: fullDocument?.account_id,
      changedFields: updatedFields,
      newLimit: fullDocument?.limit,
    });
    // 1. If limit changed
    if (updatedFields?.limit) {
      handleLimitChange(fullDocument?.account_id, updatedFields.limit);
    }

    // 2. If products changed
    if (updatedFields?.products) {
      handleProductsChange(fullDocument?.account_id, updatedFields.products);
    }
  });
  changeStream.on("error", (error) => {
    console.error("Account change stream error:", error);
    // restart stream after 5 seconds on error
    setTimeout(startAccountChangeStream, 5000);
  });

  console.log("Account change stream started ✅");
};
// handlers
const handleLimitChange = (accountId: number, newLimit: number) => {
  console.log(`Account ${accountId} limit changed to ${newLimit}`);
  // send notification, bust cache, audit log etc.
};

const handleProductsChange = (accountId: number, products: string[]) => {
  console.log(`Account ${accountId} products changed:`, products);
};

export { startAccountChangeStream };
//$changeStreamSplitLargeEvent (aggregation stage) is used to split large change events into smaller ones. This is useful when the change events contain large documents that exceed the maximum BSON document size (16MB). By splitting the events, you can ensure that they are processed without errors and can be handled more efficiently. When a change event is split, it is divided into multiple smaller events, each containing a portion of the original document. This allows you to process large changes without running into size limitations.
