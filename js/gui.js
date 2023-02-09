//controls
var gui=new dat.GUI();
var simSwitch,simulationSpeed,orientation,showGrd,grdStep,showProjection,planetVisible,rcktSteady,accel,trajectoryColor;

var controls=function() {
	this.simulationSwitch=false;
	this.simulationSpeed=simSpeed;
	this.orientation=frameAngle;
	this.showGrid=gridVisible;
	this.gridStep=gridStep;
    this.showProjection=projectionVisible;
    this.planetVisible=true;
    this.rcktSteady=rocketSteady;
    this.accel=acceleration;
    this.trajectoryColor=[trajectoryRed,trajectoryGreen,trajectoryBlue];
};
var cntrls=new controls();

function initGUI(){
	
	if (simSwitch){
		gui.remove(simSwitch);
		simSwitch=null;
	}
	if (simulationSpeed){
		gui.remove(simulationSpeed);
		simulationSpeed=null;
	}
	if (orientation){
		gui.remove(orientation);
		orientation=null;
	}
	if (showGrd){
		gui.remove(showGrd);
		showGrd=null;
	}
	if (grdStep){
		gui.remove(grdStep);
		grdStep=null;
	}
	if (showProjection){
		gui.remove(showProjection);
		showProjection=null;
	}
	if (planetVisible){
		gui.remove(planetVisible);
		planetVisible=null;
	}
	if (rcktSteady){
		gui.remove(rcktSteady);
		rcktSteady=null;
	}
	if (accel){
		gui.remove(accel);
		accel=null;
	}
	if (trajectoryColor){
		gui.remove(trajectoryColor);
		trajectoryColor=null;
	}

	gui.width=350;	

    simSwitch=gui.add(cntrls,"simulationSwitch").listen().name("Προσομοίωση");
    simSwitch.onChange(function(newValue){
    	simulating=newValue;
    	handleTimer(simulating);
    	if (newValue) reset();
    });

	simulationSpeed=gui.add(cntrls,"simulationSpeed",1,20).step(1).name("Βραδύτητα προσομοίωσης");
	simulationSpeed.onChange(function(newValue){
		simSpeed=newValue;
		defineSimulationSpeed();
    });
	
	orientation=gui.add(cntrls,"orientation",0,360).step(1).name("Προσανατολισμός");
	orientation.onChange(function(newValue){
		frameAngle=newValue;
		drawScene();
    });

	showGrd=gui.add(cntrls,"showGrid").listen().name("Πλέγμα");
	showGrd.onChange(function(newValue){
		gridVisible=newValue;
		drawScene();
	});
	
	grdStep=gui.add(cntrls,"gridStep",1,5).step(1).name("Βήμα πλέγματος");
	grdStep.onChange(function(newValue){
		gridStep=newValue;
		drawScene();
    });

	showProjection=gui.add(cntrls,"showProjection").listen().name("Προβολή τροχιάς");
	showProjection.onChange(function(newValue){
		projectionVisible=newValue;
		reset();
	});

	planetVisible=gui.add(cntrls,"planetVisible").listen().name("Βαρυτικό πεδίο");
	planetVisible.onChange(function(newValue){
		showPlanet=newValue;
		if (showPlanet){
			yAcceleration=0.05;
			accelCaption="Ένταση βαρυτικού πεδίου";
		}
		else{
			yAcceleration=0;
			accelCaption="Επιτάχυνση πυραύλου";
		}
		reset();
		initGUI();
	});

    if(!showPlanet){
    	rcktSteady=gui.add(cntrls,"rcktSteady").listen().name("Συστ.Αναφ. πυραύλου");
        rcktSteady.onChange(function(newValue){
        	rocketSteady=newValue;
        	reset();
        });
    }

	accel=gui.add(cntrls,"accel",1,maxGravity).step(1).name(accelCaption);
	accel.onChange(function(newValue){
		acceleration=newValue;
		reset();
    });

	trajectoryColor=gui.addColor(cntrls,"trajectoryColor").name("Χρώμα τροχιάς");
	trajectoryColor.onChange(function(value){
		trajectoryRed=parseInt(value[0]);
		trajectoryGreen=parseInt(value[1]);
		trajectoryBlue=parseInt(value[2]);
		drawScene();
    });
}