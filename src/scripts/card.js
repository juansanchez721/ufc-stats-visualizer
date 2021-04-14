export default class Card {

    constructor(){
        console.log("incontructor")
        this.makeCall = this.makeCall.bind(this)
//  debugger
        this.info = this.makeCall()  
        
    }


    makeCall(){
        console.log("in this api request")
        return "fighterInfo";
    }


}

// module.exports = Card