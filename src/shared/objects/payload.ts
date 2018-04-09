/**
* This file contains all of the classes and methods for dealing with Payload objects
* @author Rob Miller
* @copyright 2018
*/
import { Campaign, CampaignFactory } from '@shared/objects';

/**
* This enum represents the different payload types that are supported
*/
enum PayloadTypes {
  MESSAGE,
  CAMPAIGN
}

/**
* This interface is used for the construction of Payload objects
*/
interface PayloadData {
  src: string,
  payload: any,
  dest: string,
  type: string
}

/**
* This class represents a packet of data to be sent or received through the connection
* service
*/
export class Payload {
  public src: string;
  public dest: string;
  public type: string;
  public payload: any;

  constructor(data: PayloadData) {
    this.payload = data.payload;
    this.src = data.src;
    this.dest = data.dest;
    this.type = data.type;
  }
}

/**
* This method is used to parse the different types of payload data
*/
let parseData = (payload: PayloadData): PayloadData => {
  let rtn = null;

  switch(payload.type) {
    case PayloadTypes[PayloadTypes.MESSAGE]:
      rtn = PayloadFactory.createMessage(payload.payload, payload.src, payload.dest);
      break;
    case PayloadTypes[PayloadTypes.CAMPAIGN]:
      let campaign: Campaign = CampaignFactory.fromBroadcast(payload.payload);
      rtn = PayloadFactory.createCampaign(campaign, payload.src, payload.dest);
      break;
  }

  return rtn;
}

/**
* This class is responsible for the creation and manipulation of Payload objects
*/
export class PayloadFactory {
  /**
  * Create a new payload with the given parameters
  * @param payload
  * @param src
  * @param dest
  * @param type
  * @return the created Payload object
  */
  public static createPayload(payload: any, src: string, dest: string, type: string): Payload {
    return new Payload({payload: payload, src: src, dest: dest, type: type});
  }

  /**
  * Create a message payload object
  * @param message
  * @param src
  * @param dest
  * @return the created message payload
  */
  public static createMessage(message: string, src: string, dest: string): Payload {
    return new Payload({payload: message, src: src, dest: dest, type: "MESSAGE"})
  }

  /**
  * Create a campaign payload object
  * @param campaign
  * @param src
  * @param dest
  * @return the created campaign payload
  */
  public static createCampaign(campaign: Campaign, src: string, dest: string) {
    return new Payload({payload: campaign, src: src, dest: dest, type: "CAMPAIGN"});
  }

  /**
  * Parse a payload object from a JSON string
  * @param json
  * @return the parsed payload
  */
  public static fromJSON(json: string): Payload {
    let data = parseData(<PayloadData>JSON.parse(json));
    return new Payload({ payload: data.payload, src: data.src, dest: data.dest, type: data.type });
  }
}
