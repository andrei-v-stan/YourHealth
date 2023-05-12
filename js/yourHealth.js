
const animate = async () => {
  const mainSquare = document.getElementById("mainSquare");
  mainSquare.classList.add("slideTopCenterBlur");

  await new Promise(resolve => setTimeout(resolve, 1000));
    const underMainSquare = document.getElementById("underMainSquare");
    underMainSquare.style.display = "flex";
    underMainSquare.classList.add("mainRipple");

  await new Promise(resolve => setTimeout(resolve, 1000));
  circleList = ["circleBody","circleMind","circleDiet","circleSleep"]
  rollTranslationsX = ["-30vw", "30vw", "-30vw", "30vw"]
  rollTranslationsY = ["-36vh", "-36vh", "36vh", "36vh"]

  function animateCircle(i) {
    const circleElem = document.getElementById(`${circleList[i]}`);
    circleElem.style.display = "block";
    circleElem.classList.add("rollAnimation");
    animateElem = document.querySelector(`#${circleList[i]}`);
    animateElem.style.setProperty('--rollTranslateX', `${rollTranslationsX[i]}`);
    animateElem.style.setProperty('--rollTranslateY', `${rollTranslationsY[i]}`);
  }

  for (let i=0; i<4; i++) {
    setTimeout(function() {
      animateCircle(i);
    }, i * 1500);
  }

  await new Promise(resolve => setTimeout(resolve, 6100));
    circleElem = document.getElementById(`${circleList[1]}`);
    circleElem.classList.add("breathingAnimation");
    animateElem = document.querySelector(`#${circleList[1]}`);
    animateElem.style.setProperty('--breathTranslateX', `${rollTranslationsX[1]}`);
    animateElem.style.setProperty('--breathTranslateY', `${rollTranslationsY[1]}`);

  await new Promise(resolve => setTimeout(resolve, 1500));
    mainSquare.classList.add("easeOutAnimation");
  
  await new Promise(resolve => setTimeout(resolve, 500));
    circleElem.classList.remove("breathingAnimation");
    circleElem = document.getElementById(`subCircleMind`);
    circleElem.classList.add("slideInAnimation");
    animateElem = document.querySelector(`#subCircleMind`);
    animateElem.style.setProperty('--slideTranslateX', `${rollTranslationsX[1]}`);
    animateElem.style.setProperty('--slideTranslateY', `${rollTranslationsY[1]}`);

};

animate();
