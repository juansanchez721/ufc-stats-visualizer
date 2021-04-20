export default class Card {

    constructor(){
        console.log("incontructor")
        this.makeCall = this.makeCall.bind(this)
        this.info = this.makeCall()  
        
    }


    makeCall(){
        console.log("in this api request")
        return "fighterInfo";
    }


}

