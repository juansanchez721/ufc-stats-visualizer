export const scrollerInit = () => {
  document
  .getElementById("left-arrow")
  .addEventListener("click", (event) => {
    scrollbar("left");
  });

  document
  .getElementById("right-arrow")
  .addEventListener("click", (event) => {
    scrollbar("right");
  });

  document
    .getElementById("data-container")
    .addEventListener("wheel", (e) => {
      if (e.type != "wheel") {
        return;
      }
      // if( scrollPositionIsAtTheEnd ) {
      //   return;
      // }
      elementScroll(e)
      // safari needs also this
      // document.getElementById("data-container").scrollLeft -= delta;
      // e.preventDefault();
    });
};

const elementScroll = (e) => {
  let delta = (e.deltaY || -e.wheelDelta || e.detail) >> 10 || 1;
  let shiftAmount =   document.getElementById("data-container").clientWidth > 880 ? 880 : 390;

  delta = delta * (-shiftAmount);
  console.log(delta)
  document.getElementById("data-container").scrollLeft -= delta;

  // if(start < 2000) {
  //     window.requestAnimationFrame(elementScroll(e, start+500))
  // }

}

export const scrollbar = (direction) => {
  let dataContainer = document.getElementById("data-container");

  let shiftAmount = dataContainer.clientWidth > 880 ? 880 : 440;
  console.log(dataContainer.scrollLeft);
  console.log(shiftAmount);

  switch (direction) {
    case "left":
      // console.log(dataContainer.offsetWidth + "you wanna scroll left?")
      dataContainer.scrollLeft = dataContainer.scrollLeft - shiftAmount;
      debugger;
      break;
    case "right":
      dataContainer.scrollLeft = dataContainer.scrollLeft + shiftAmount;
      debugger;

      break;

    default:
      break;
  }
};
