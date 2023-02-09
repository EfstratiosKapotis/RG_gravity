var planetLeft=-220;
var planetTop=250;
var rocketLeft=150;
var rocketTopInit=120;
var rocketTop=rocketTopInit;
var rocketDx=57;
var rocketDy=50;
var rocketMaxX=rocketLeft+100;
var showPlanet=true;
var trajectory=[];
var trajectoryRed=255;
var trajectoryGreen=0;
var trajectoryBlue=0;
var t=0;
var trajectoryVx=2;
var trajectoryVy=0;
var acceleration=1;
var maxGravity=7;
var accelCaption="Ένταση βαρυτικού πεδίου";
var projectionVisible=false;
var rocketSteady=false;

//frame of reference
var userDefinedFrame=false;
var frameAngle=0;
var newOriginX=0;
var newOriginY=0;


function initialiseExperiment(){
	experimentInitialised=false;
	newOriginX=canvas.width/2;
	newOriginY=canvas.height/2;
	initGUI();
    setReferenceFrame();
	reset();
	drawBackground();
	experimentInitialised=true;
}

/*function previousFrame(){
	clock1.setValue(clock1.m_Value-1);
	clock2.setValue(clock2.m_Value-1);
	ray.trailX.splice(ray.trailX.length-1,1); 
	ray.trailY.splice(ray.trailY.length-1,1);
	drawScene();
}*/

function nextFrame(){
	//calculate trajectory
	var newX=rocketLeft+rocketDx+trajectoryVx*t;
	var newY=0;
	if (showPlanet){
		newY=rocketTopInit+rocketDy+trajectoryVy*t+0.5*acceleration*0.05*Math.pow(t,2);
	}
	else{
		//Η επόμενη εντολή υπάρχει μόνο για λόγους πληρότητας
		//Δεν προβλέπεται ΕΟΚ του πυραύλου
		newY=rocketTopInit+rocketDy+trajectoryVy*t;

		//place rocket
		if (rocketSteady){
			gridOrigin=0.5*acceleration*0.05*Math.pow(t,2);
			while (gridOrigin>=gridBase*gridStep) {
				gridOrigin-=gridBase*gridStep;
			}
			while (gridOrigin<=-gridBase*gridStep){
				gridOrigin+=gridBase*gridStep;
			}
			newY=rocketTopInit+rocketDy+trajectoryVy*t+0.5*acceleration*0.05*Math.pow(t,2);
		}
		else{
			rocketTop=rocketTopInit-0.5*acceleration*0.05*Math.pow(t,2);
		}
	}
	t++;
	trajectory.push({x:newX,y:newY});
	drawScene();
	if (newX>=rocketMaxX){
		document.getElementById("btnNextFrame").disabled=true;
		simulating=false;
		handleTimer(simulating);
		/*cntrls.simulationSwitch=false;
		gui.__controllers[0].updateDisplay(false);*/
	}
}

function reset(){
	t=0;
	gridOrigin=0;
	document.getElementById("btnNextFrame").disabled=false;
	rocketTop=rocketTopInit;
	resetTrajectory();
	drawScene();
}

function drawScene(){
	if (experimentInitialised){
		clearGraphics();
		setReferenceFrame();
		drawBackground();
		showGrid();
		drawTrajectory();
		restoreReferenceFrame();
	}
}

function setReferenceFrame(){
	if (!userDefinedFrame){
		userDefinedFrame=true;
		context.save();
		// move the origin to center of canvas   
		context.translate(newOriginX,newOriginY); 
		context.rotate(frameAngle*Math.PI/180);
	}
}

function restoreReferenceFrame(){
	if(userDefinedFrame){
		userDefinedFrame=false;
		context.restore();
	}
}

function drawBackground(){
    if (showPlanet){
		context.globalAlpha=acceleration/maxGravity;
		context.drawImage(planet,planetLeft-newOriginX,planetTop-newOriginY);
		context.globalAlpha=1;
		context.drawImage(planetSketch,planetLeft-newOriginX,planetTop-newOriginY);
    }
    context.drawImage(rocket,rocketLeft-newOriginX,rocketTop-newOriginY);
}

function resetTrajectory(){
	for(var i=trajectory.length-1;i>-1;i--){
		trajectory.splice(i,1);
	}
}

function drawTrajectory(){
	context.strokeStyle="rgb("+trajectoryRed+","+trajectoryGreen+","+trajectoryBlue+")";
	context.fillStyle="rgb("+trajectoryRed+","+trajectoryGreen+","+trajectoryBlue+")";
	context.beginPath();
	for(var i=0;i<trajectory.length;i++){
		context.fillRect(trajectory[i].x-newOriginX,trajectory[i].y-newOriginY,2,2);
		if (projectionVisible){
			//context.fillRect(rocketMaxX+1,trajectory[i].y-rocketTopInit+rocketTop,3,3);
			context.fillRect(rocketMaxX+1-newOriginX,rocketTop+rocketDy+0.5*acceleration*0.05*Math.pow(i,2)-newOriginY,3,3);
			
		}
	}
	context.fill();

}