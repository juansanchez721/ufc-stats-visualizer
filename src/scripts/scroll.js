export const scrollerInit = () => {

    document.getElementById("left-arrow").addEventListener("click", (event) =>{
        scrollbar("left")
    })

    document.getElementById("right-arrow").addEventListener("click", (event) =>{
        scrollbar("right")
    })
  
  
  }

  export const scrollbar = (direction) => {

    let dataContainer = document.getElementById("data-container")

    let shiftAmount = dataContainer.clientWidth > 880?  880 : 440
    console.log(dataContainer.scrollLeft)
    console.log(shiftAmount)
    
    switch (direction) {
        case "left":
          // console.log(dataContainer.offsetWidth + "you wanna scroll left?")  
          dataContainer.scrollLeft = dataContainer.scrollLeft - shiftAmount
          debugger
          break;
        case "right":
          dataContainer.scrollLeft = dataContainer.scrollLeft + shiftAmount
          debugger

      break;
    
        default:
          break;
      }
  }