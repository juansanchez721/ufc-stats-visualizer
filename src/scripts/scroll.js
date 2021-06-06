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
    
    switch (direction) {
        case "left":
          console.log(dataContainer.offsetWidth + "you wanna scroll left?")  
          dataContainer.scrollLeft = dataContainer.scrollLeft - (dataContainer.offsetWidth/11)
          debugger
          break;
        case "right":
          console.log(dataContainer.scrollWidth)  
          dataContainer.scrollLeft = dataContainer.scrollLeft + (dataContainer.offsetWidth/11)
          debugger

      break;
    
        default:
          break;
      }
  }