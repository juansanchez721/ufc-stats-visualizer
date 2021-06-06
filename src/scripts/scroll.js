export const scrollerInit = () => {

    document.getElementById("left-arrow").addEventListener("click", (event) =>{
        scrollbar("left")
    })

    document.getElementById("right-arrow").addEventListener("click", (event) =>{
        scrollbar("right")
    })
  
  
  }

  export const scrollbar = (direction) => {

    let dataContainerInner = document.getElementById("data-container")

    switch (direction) {
        case "left":
          console.log(dataContainerInner.scrollWidth + "you wanna scroll left?")  
          debugger
          dataContainerInner.scrollLeft = 200
          break;
        case "right":
          console.log(dataContainerInner.scrollWidth)  
          debugger
          dataContainerInner.scrollLeft = -200

      break;
    
        default:
          break;
      }
  }