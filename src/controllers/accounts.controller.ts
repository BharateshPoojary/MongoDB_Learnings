import { Request, Response } from "express";
import { accountModel } from "../models/account.model";

const getCustomerAccounts = async (req: Request, res: Response) => {
  try {
    // Pipeline 1: collection stats (standalone)
    // const [collectionStats] = await accountModel.aggregate([
    //   {
    //     $collStats: {//As the name suggests this stage returns the entire statistics of the collection on which we applies thid stage
    //       latencyStats: { histograms: true },//Latency stats specify the amount of time taken in read , write requests , database transaction and commands
    //       storageStats: { scale: 1024 },//It shows the amount of space taken by the collection document both compressesed and uncompressed
    //       count: {},//It retrns the count of the documents
    //       queryExecStats: {},
    //     },
    //   },//This is the stage which gives completely different out put which is of no use in other collection so it is mostly used as single stage in the pipeline
    // ]);
    const Aggregation_Pipeline = await accountModel.aggregate([
      {
        $addFields: {
          //$set is the alias for $addFields and both works same
          //This stage enables us to add some specific properties with each document
          type: "saving", //here we added type property so it will be added in each doc along with every property of that document
          test: true,
        },
      }, //We can add only one stage at a time
      {
$facet:{
  //This stage is used to perform multiple aggregation pipelines within a single stage on the same set of input documents. It allows us to divide the input documents into multiple groups and process each group with a different pipeline, returning the results in a single output document.
}
      },
      {
        $sample: {
          size: 5,
        },
      },
      {
        $project: {
          //This stage enables us to select specific property from the document
          limit: 1,
          type: 1,
          account_id: 1,
        }, //In this stage we selected 2 properties type and account_id by setting the value to 1 we are selecting those 2 properties from ecah document
      },
      {
        //This stage is as similar as the argument we specify inside find  where it takes the fieldname and the value could be anything may be a expression like here we used $gt and it returns the matching document
        $match: {
          limit: {
            //This is the filed name
            $gt: 10000, //Here we are  picking the accounts which has limit greater than 10k
          },
        },
      },
      {
        //This stage allow us to get the count of the document , this stage got from its previous stage and returns the count of the docs with the output field name  we have to  specify in the $count property
        $count: "limitgreaterthan10k",
      },
      //Both the above stages reshapes each document in the stream
      // {
      //   $bucket: {//Categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries and outputs a document per each bucket.
      //     groupBy: "$limit", // field to bucket on i.e It will be the field on the basis of  which the grouping will happen
      //     boundaries: [0, 3000,5000,10000], // defines 1 bucket: where the id will be 0 and rest all will come in default bucket  "Other" which does not comes between 0,4999
      //     default: "Other", // catch-all for values outside boundaries this is the literal which we are specifying it will come in id property
      //     output: {//Here we are designing the output which will be the result of each bucket
      //       count: { $sum: 1 }, // how many docs fall in each bucket
      //       accounts: { $push: "$account_id" }, // collect account_ids from  the documents to whose  bucket this output belongs  and will push into an array
      //       avgLimit: { $avg: "$limit" }, // average limit in each bucket
      //     },
      //   },
      // },
      // {
      //   $bucketAuto: {
      //     groupBy: "$limit", // field to group on
      //     buckets: 5, // I want exactly  5 buckets — MongoDB decides boundaries but if all documents gets exhausted in a single decided boundary of mongodb we will get only 1 bucket and not 5 it means max we will get 5 buckets
      //     output: {
      //       count: { $sum: 1 },
      //       accounts: { $push: "$account_id" },
      //       avgLimit: { $avg: "$limit" },
      //     },
      //     granularity: "1-2-5", // optional — snaps boundaries to a standard number series
      //     //Optional. A string that specifies the preferred number series to use to ensure that the calculated boundary edges end on preferred round numbers or their powers of 10.
      //     // Our limits are round numbers (500, 9000, 10000) that naturally align with the 1-2-5 scale (…500, 1000, 2000, 5000, 10000, 20000…). so we choose 1-2-5
      //     //There are  different types of granularity for different types of numeric values  https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucketAuto/
      //     //granularity only works when   only if the all groupBy values are numeric and none of them are NaN.
      //     // Available only if the all groupBy values are numeric and none of them are NaN.
      //   },
      // },
    ]);

    res.json({
      success: true,
      // stats: collectionStats,
      data: Aggregation_Pipeline,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      data: "Something went wrong ",
    });
  }
};

const updateAccountLimit = async (req: Request, res: Response) => {
  try {
    const { accountId, newLimit } = req.body;

    await accountModel.updateOne(
      { account_id: accountId },
      { $set: { limit: newLimit } },
    );

    // 👆 This update will automatically trigger your changeStream
    // You'll see the console.log fire in startAccountChangeStream

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false });
  }
};
export { getCustomerAccounts, updateAccountLimit };
