"use strict";

const ANIM_SHRINK_GROW_DURATION = 500,
      ANIM_FADE_IN_OUT_DURATION = 500,
      BACKGROUND_CHANGE_EVENT  = "EVENT_BACKGROUND_CHANGE";

/**
 *  A very messy file to handle scripts specific to
 * this page. TODO This file needs a refactoring.
 */

function LogoBulb()
{
    const me = this;
    WorldObject.apply(me);
    
    this.textureCanvas = document.createElement("canvas");
    this.textureCtx = this.textureCanvas.getContext("2d");
    
    me.textureCtx.fillStyle = "gray";
    me.textureCtx.fillRect(0, 0, me.textureCtx.canvas.width,
                                 me.textureCtx.canvas.height);
    me.transformMat.scale(4, 3, 4);
    
    this.getModel = function()
    {
        return ModelHelper.Objects.get("Bulb", "Cube");
    };
    
    this.animate = function(renderer, deltaT)
    {
        // Nothing for now.
    };
    
    this.preRender = function(renderer)
    {
        renderer.setShine(1000);
        renderer.setTint(new Vector3(0.5, 0.5, 0.5));
    };
}

function LogoInner()
{
    const me = this;
    WorldObject.apply(me);
    
    this.textureCanvas = document.createElement("canvas");
    this.textureCtx = this.textureCanvas.getContext("2d");
    
    me.textureCtx.fillStyle = "orange";
    me.textureCtx.fillRect(0, 0, me.textureCtx.canvas.width, me.textureCtx.canvas.height);
    
    me.textureCtx.fillStyle = "white";
    me.textureCtx.font = "bold 14em Serif";
    me.textureCtx.textAlign = "left";
    me.textureCtx.textBaseline = "alphabetic";
    me.textureCtx.fillText("<:>", 0, me.textureCtx.canvas.height * 2 / 3);
    
    me.transformMat.translate([-50, -125, 50]);
    me.transformMat.scale(2, 3, 2);
    
    this.getModel = function()
    {
        // For now, just return a cube.
        return ModelHelper.Objects.get("Cube");
    };
    
    this.animate = function(renderer, deltaT)
    {
        // Nothing for now.
    };
    
    this.preRender = function(renderer)
    {
        renderer.setShine(10000);
        renderer.setTint(new Vector3(0.0, 0.0, 0.0));
    };
}

function BackgroundCube()
{
    const me = this;
    WorldObject.apply(me);
    
    this.textureCanvas = document.createElement("canvas");
    this.textureCtx = this.textureCanvas.getContext("2d");
    
    me.textureCtx.fillStyle = "#ffffff";
    me.textureCtx.fillRect(0, 0, me.textureCtx.canvas.width, me.textureCtx.canvas.height);
    
    me.textureCtx.fillStyle = "black";
    me.textureCtx.font = "bold 12em Serif";
    me.textureCtx.textAlign = "left";
    me.textureCtx.textBaseline = "alphabetic";
    me.textureCtx.fillText("</>", 0, me.textureCtx.canvas.height / 2);
    
    this.getModel = function()
    {
        // A cube!
        return ModelHelper.Objects.get("Cube");
    };
    
    this.animate = function(renderer, deltaT)
    {
        // Nothing for now.
    };
    
    this.preRender = function(renderer)
    {
        renderer.setShine(5000); // Not super shiny.
    };
}

function LogoWorld()
{
    const me = this;
    WorldBox.apply(me);
    
    let firstBulb = new LogoBulb();
    let secondBulb = new LogoBulb();
    let innerLogo = new LogoInner();
    
    let worldZRotation = 0;
    let worldZRotationTarget = 0;
    let worldRotateFactor = 0.9;
    let modifier = 0.0;
    let modifierTarget = 0.0;
    let modifierChangeFactor = 0.96;
    let updateFactor = 30;
    
    // We don't want all logos to look exactly the same.
    //Give each a time offset.
    let timeOffset = - Math.floor((new Date()).getTime() - 10000); // Start every visitor
                                                                   //at the same time.
    this.forcedTime = 0; // No forced time by default.
    
    this.registerObject(firstBulb);
    this.registerObject(secondBulb);
    this.registerObject(innerLogo);
    
    this.preRender = function(renderer)
    {
        if (me.destinationCtx !== undefined)
        {
            renderer.setFogColor({ x: 0.7, y: 0.2, z: 0.7, w: 0.01});
            renderer.setZMax(2000);
            renderer.setFogDecay(1000 * (1 - modifier) + 500);
            renderer.setClearColor([0, 0, 0, 0.01]);
            
            renderer.setTint(new Vector3(0.5, 0.5, 0.5));
            
            renderer.setLightPosition(new Vector3(-40.0, 100.0, 700.0));
        }
            
        renderer.worldMatrix.save();
        
        // Handle camera rotation.
        renderer.worldMatrix.rotateZ(worldZRotation);
    };
    
    this.animate = (renderer, deltaT) =>
    {
        this.animateChildren(renderer, deltaT);
        
        let time = me.forcedTime || ((new Date()).getTime() + timeOffset + 60000 * modifier * Math.PI);
        
        firstBulb.transformMat.save();
        secondBulb.transformMat.save();
        
        let rotationAmount = Math.sin(time / 60000) / 4;
        
        // Also, check: Are we to rotate?
        if (me.destinationCtx 
            && me.destinationCtx.canvas.classList.contains("requestRotate"))
        {
            worldZRotationTarget = -Math.PI / 2;
            modifierTarget = 1;
        }
        else
        {
            worldZRotationTarget = 0;
            modifierTarget = 0;
        }
        
        firstBulb.transformMat.rotateY(Math.PI * 0.9 + rotationAmount * Math.PI / 2);
        secondBulb.transformMat.rotateY(Math.PI * 5/6 - rotationAmount * Math.PI / 2);
        secondBulb.transformMat.rotateZ(Math.abs(Math.sin(rotationAmount)) * Math.PI / 32);
        firstBulb.transformMat.rotateZ(-Math.pow(Math.sin(rotationAmount * 32), 2) * Math.PI / 27);
        
        firstBulb.transformMat.translate([0, 100, 40]);
        secondBulb.transformMat.translate([Math.sin(time / 500), 100, 38]);
        
        
        // Update the modifiers
        if (worldZRotation != worldZRotationTarget)
        {
            worldZRotation = (worldZRotation * Math.pow(worldRotateFactor, deltaT / updateFactor) 
                    + worldZRotationTarget * (1 - Math.pow(worldRotateFactor, deltaT / updateFactor)));
        }
        
        if (modifier != modifierTarget)
        {
            modifier = (modifier * Math.pow(modifierChangeFactor, deltaT / updateFactor) + modifierTarget * (1.0 - Math.pow(modifierChangeFactor, deltaT / updateFactor)));
        }
    };
    
    this.cleanup = (renderer) =>
    {
        me.cleanupChildren(renderer);
        
        firstBulb.transformMat.restore();
        secondBulb.transformMat.restore();
        renderer.worldMatrix.restore();
    };
}

function BackgroundAnimationWorld(worldManager, initialBackground)
{
    const me = this;
    WorldBox.apply(me);
    
    let logoWorld = new LogoWorld();
    let worldCube = new BackgroundCube();
    
    let backgroundRenderScripts =
    {
        "logoAndWalls": (currentObject, renderer, time) =>
        {
            if (currentObject != worldCube)
            {
                return true; // Let the base world class render it.
            }
            
            // Otherwise, render things with the cube.
            
            renderer.setShine(500);
            
            // The ground.
            worldCube.transformMat.save();
            
                let groundWidth = 9000;
                let groundLength = 9000;
                
                worldCube.transformMat.scale(groundWidth, 10, groundLength);
                
                // Center it.
                worldCube.transformMat.translate([-groundWidth * 25, groundDepth, -25 * groundLength / 2]);
                
                renderer.setTint(new Vector3(0.0, 0.0, 0.0));
                worldCube.render(renderer);
            
            worldCube.transformMat.restore();
            
            // The blocks.
            for (let i = -Math.PI / 2; i < Math.PI / 2; i += 0.3)
            {
                worldCube.transformMat.save();
                
                worldCube.transformMat.translate([Math.sin(i) * 50, groundDepth - 50 - Math.abs(Math.tan(i * 3) * groundDepth), 700 + Math.sin(i) * 300]);
                worldCube.transformMat.rotateY(i * 3 + i * time / 10);
                worldCube.transformMat.translate([0, 0, -10]);
                worldCube.transformMat.scale(2.0, 2.0 + Math.sin(time / 10) / 5, 2.0);
                
                renderer.setTint(new Vector3
                (
                    Math.abs(Math.sin(i)) / 4, Math.abs(Math.cos(i / 2)) / 4, Math.abs(Math.cos(i * 2)) / 4
                ));
                
                worldCube.render(renderer);
                
                worldCube.transformMat.restore();
            }
            
            // The mountains.
            for (let x = -groundWidth / 2; x < groundWidth / 2; x += groundWidth / 26)
            {
                worldCube.transformMat.save();
                
                worldCube.transformMat.rotateX(Math.abs(Math.sin(x * x * x)) * 2);
                worldCube.transformMat.rotateY(Math.sin(x * x * x));
                worldCube.transformMat.rotateZ(Math.PI);
                worldCube.transformMat.scale(Math.abs(Math.cos(x)) * 10 + 5, Math.abs(Math.tan(x) * 16) + 5, Math.abs(Math.sin(x*x)) * 80 + 5);//groundWidth / 100, groundLength, groundLength / 100);
                
                worldCube.transformMat.translate([x, groundDepth - 100, -5000]);//groundDepth - 100, groundLength + 130 + Math.cos(x) * 50]);
                
                
                
                renderer.setTint(new Vector3
                (
                    0, 0, 0
                ));
                
                worldCube.render(renderer);
                
                worldCube.transformMat.restore();
            }
        },
        
        "logo": (currentObject, renderer, time) =>
        {
            if (currentObject != worldCube)
            {
                return true; // Let the base world class render it.
            }
            
            // Do things with the blocks.
            for (let i = -Math.PI; i < Math.PI; i += 0.3)
            {
                worldCube.transformMat.save();
                
                worldCube.transformMat.translate([Math.sin(i) * 50, groundDepth - 50 - Math.abs(Math.tan(i * 3) * groundDepth), 700 + Math.sin(i) * 300]);
                worldCube.transformMat.rotateY(i * 3 + i * time / 10);
                worldCube.transformMat.translate([0, 0, -10]);
                worldCube.transformMat.scale(2.0, 2.0 + Math.sin(time / 10) / 5, 2.0);
                
                renderer.setTint(new Vector3
                (
                    Math.abs(Math.sin(i)) / 4, Math.abs(Math.cos(i / 2)) / 4, Math.abs(Math.cos(i * 2)) / 4
                ));
                
                worldCube.render(renderer);
                
                worldCube.transformMat.restore();
            }
        },
        
        "empty": (currentObject, renderer, time) =>
        {
            return false;
        }
    };
    
    this.currentBackground = initialBackground;
    this.registerObject(worldCube);
    
    this.registerObject(logoWorld);
    
    let groundDepth = 300;
    
    // Force the logo's time -- we don't want animation.
    logoWorld.forcedTime = 10;
    
    this.preRender = function(renderer)
    {
        renderer.setFogColor({ x: 0.4, y: 0.5, z: 0.6, w: 0.01});
        
        renderer.setZMax(90000);
        renderer.setFogDecay(10000);
        
        renderer.setTint(new Vector3(0.5, 0.5, 0.5));
        
        renderer.setLightPosition(new Vector3(0.0, 0.0, 0.0));
    };
    
    // Do additional renderings for the 
    //cube.
    this.onRender = function(currentObject, renderer)
    {
        let time = (new Date()).getTime() / 1000000;
        
        if (this.currentBackground in backgroundRenderScripts)
        {
            return backgroundRenderScripts[this.currentBackground](currentObject, renderer, time);
        }
        
        // Default rendering if the script does not exist.
        return true;
    };
    
    this.animate = (renderer, deltaT) =>
    {
        this.animateChildren(renderer, deltaT);
        
        logoWorld.transformMat.save();
        
        logoWorld.transformMat.scale(10, 10, 10);
        logoWorld.transformMat.translate([0, groundDepth - 1000, -3100]);
    };
    
    this.noteScroll = function(scrollTop, scrollHeight)
    {
        me.transformMat.toIdentity();
        
        me.transformMat.translate([0, -scrollTop, 40]);
        
        groundDepth = scrollHeight + 10;
    };
    
    this.selectBackground = function(backgroundName)
    {
        this.currentBackground = backgroundName;
    };
    
    this.cleanup = (renderer) =>
    {
        me.cleanupChildren(renderer);
        
        logoWorld.transformMat.restore();
    };
}

async function registerLogoObjects()
{
    const SILHOUETTE_DIVISIONS = 35,
          NORMALS_TOLERANCE = 0.6,
          REVOLUTION_DIVISIONS = 20;
          
    // Push logo generation to the background.
    const thread = ThreadHelper.makeLibLinkedThread();
    
    // Put the logo generation tasks.
    const generateVerticies = (silhouetteDivisions, revolveDivisions) =>
    new Promise((resolve, reject) =>
    {
        const SCALE = 15;
        let maxI = 7;
        let socketLen = 0.5;
        
        let silhouette = [];
        let point;
        let stretchedI;
        
        silhouette.push(new Point(0, socketLen * SCALE));
        
        for (var i = -socketLen; i <= maxI; i += maxI / silhouetteDivisions)
        {
            stretchedI = i < maxI / 3 ? i / (i + 1) : i;
            
            if (i > maxI * 1 / 8)
            {
                point = new Point(
                    SCALE * (Math.tan(i / maxI * Math.PI / 4) + 1) * Math.sqrt(4 - (stretchedI - 1) * (stretchedI - 2) / (stretchedI + 0.5)),
                    -i * SCALE);
            }
            else
            {
                point = new Point(SCALE * 1.5, -i * SCALE);
            }
            
            silhouette.push(point);
        }
        
        silhouette.push(new Point(0, -i * SCALE));
        
        let verticies = ModelHelper.silhouetteToVerticies
        (
            silhouette,
            0,      // Start angle,
            Math.PI * 4 / 3, // end angle.
            revolveDivisions
        );
        
        resolve(verticies);
    });
    
    const generateNormals = (verticies, normalsTolerance) =>
    new Promise((resolve, reject) =>
    {
        let normals = ModelHelper.computeNormals(verticies, normalsTolerance);
        
        resolve(normals);
    });
    
    // Put the tasks.
    thread.putFunction("generateVerticies", ["silhouetteDivisions", "revolveDivisions"], generateVerticies);
    thread.putFunction("generateNormals", ["verticies", "normalsTolerance"], generateNormals);
    
    thread.compile();
    
    // Call them.
    let verticies = await thread.callFunction("generateVerticies", 
            [SILHOUETTE_DIVISIONS, REVOLUTION_DIVISIONS]);
    let normals = await thread.callFunction("generateNormals", [verticies, NORMALS_TOLERANCE]);
    
    ModelHelper.Objects.register("Bulb",
        verticies, normals, undefined, undefined,
        JSHelper.getArrayOfRandomColors(verticies.length,
            false, // No rounding.
            3, // 3 components
            0.4, 0.4, // Min maxes.
            0.4, 0.4,
            0.6, 0.6
            )
    );
    
    // This is an async function, so it returns a promise.
    return true;
}

/**
 * Loads all logo objects in the page. This is necessary for the animated portion of the logo.
 */
function loadLogos(worldManager)
{
    // First, register logo-associated objects.
    return registerLogoObjects().then(() =>
    {
        let allLogos = document.getElementsByClassName("logo");
        let currentLogo, subWorld;
        
        for (var i = 0; i < allLogos.length; i++)
        {
            currentLogo = allLogos[i];
            subWorld = new LogoWorld();
            
            // All logos should also be canvases.
            subWorld.setDestinationCanvas(currentLogo);
            
            // Register the world.
            worldManager.registerWorld(subWorld);
            
            // Fade the logo in.
            currentLogo.style.animation = "1s ease fadeIn";
            
            // Set the page's favicon.
            setTimeout(() =>
            {
                let iconLink = document.querySelector("link[rel*='icon']");
        
                if (!iconLink)
                {
                    iconLink = document.createElement("link");
                    iconLink.rel = "icon";
                    iconLink.type = "image/xicon";
                    iconLink.href = currentLogo.toDataURL("img/png");
                    
                    document.querySelector("head").appendChild(iconLink);
                }
            }, 500); // Fade-in takes time. Wait.
        }
    });
}

function startBackgroundAnimation(worldManager, scrolledElement, initialBackground)
{
    let backgroundAnimationCanvas = document.querySelector("#backgroundAnimation");
    
    let scene = new BackgroundAnimationWorld(worldManager, initialBackground);
    
    scene.setDestinationCanvas(backgroundAnimationCanvas);
    scene.outputResolution = 1 / 10.0;
    
    let idleWorldUpdateRate = 250;
    let updateWorldRate = idleWorldUpdateRate;
    let lastTimeout, resetUpdateRateTimeout;
    
    window.addEventListener("scroll", () =>
    {
        // Update more frequently.
        updateWorldRate = 10;
        
        // If we can, render sooner.
        if (lastTimeout !== undefined)
        {
            clearTimeout(lastTimeout);
            
            sceneUpdateLoop();
        }
        
        // Cancel the update rate reset.
        if (resetUpdateRateTimeout !== undefined)
        {
            clearTimeout(resetUpdateRateTimeout);
        }
        
        // Reset the update rate in 3 seconds.
        resetUpdateRateTimeout = setTimeout(() =>
        {
            updateWorldRate = idleWorldUpdateRate;
        }, 3000);
    }, true);
    
    worldManager.updateWorld(scene);
    
    // Flash the background!
    let flashBackground = () =>
    {
        backgroundAnimationCanvas.classList.add("fadeInOut");
            
        setTimeout(() =>
        {
            backgroundAnimationCanvas.classList.remove("fadeInOut");
        }, ANIM_FADE_IN_OUT_DURATION);
    };
    
    // Do so once as we transition in.
    flashBackground();
    
    // Every half-second or so, update the scene
    // -- it is an animation, but it is a slow animation.
    let sceneUpdateLoop;
    sceneUpdateLoop = () =>
    {
        // Update everything else.
        worldManager.loopOnce();
        
        // Note the current scroll amount.
        scene.noteScroll(scrolledElement.scrollTop, scrolledElement.scrollHeight);
        
        // Update the scene.
        worldManager.updateWorld(scene);
        
        // Bring the rate closer to the idle update rate.
        updateWorldRate = updateWorldRate * 7 / 8 + idleWorldUpdateRate / 8;
        
        // Update the view.
        lastTimeout = setTimeout(sceneUpdateLoop, updateWorldRate);
    };
    
    // Wait for a notification requesting that the background change.
    let sceneChangeLoop = async function()
    {
        while (true) // It's an async function. We can do this!
        {
            let newBackgroundName = await JSHelper.Notifier.waitFor(BACKGROUND_CHANGE_EVENT);
            
            // Transition!
            flashBackground();
            
            scene.selectBackground(newBackgroundName);
        }
    };
    
    sceneUpdateLoop();
    sceneChangeLoop();
    
    window.addEventListener("resize", () =>
    {
        worldManager.updateWorld(scene);
    });
    
    backgroundAnimationCanvas.style.backgroundColor = "#000000";
}

function initLibraries()
{
    // Initialize the database.
    CloudHelper.initDB(window.firebase, 
    {
        apiData:
        {
            apiKey: "AIzaSyCFiXolx5nvkMUBYfCZxqHy_-bZjL2s5tM",
            authDomain: "proj-ect.firebaseapp.com",
            databaseURL: "https://proj-ect.firebaseio.com",
            projectId: "proj-ect",
            storageBucket: "proj-ect.appspot.com",
            messagingSenderId: "1050739360656",
            appId: "1:1050739360656:web:23e4a9ab109a5119836915"
        },
        resources:
        [
            CloudHelper.Service.FIRESTORE
        ]
    });
    
    // If firebase isn't defined,
    //warn the user.
    if (!window.firebase)
    {
        SubWindowHelper.alert("Service Error", `This page uses Google's <i>Firebase</i> service to load 
                                                much of its content. An error occurred while connecting
                                                to this service. Please check your internet connection
                                                and refresh the page.`,
                                                undefined, // No onclose listener.
                                                true); // Use HTML text.
    }
}

function main()
{
    const worldManager = new FullWorld();
    
    // Initial background await.
    let initialBackground = undefined;
    
    JSHelper.Notifier.waitFor(BACKGROUND_CHANGE_EVENT).then((backgroundName) =>
    {
        initialBackground = backgroundName;
    });
    
    // Initialize 3rd-party libraries.
    initLibraries();
    
    // Initialize content.
    ContentManager.init();
    
    // Load all logos (the animations).
    loadLogos(worldManager).then(() =>
    {
        // Load the background animation.
        startBackgroundAnimation(worldManager, document.documentElement, initialBackground);
    }).then(() =>
    {
        // On complete, note that the page has been set up.
        JSHelper.Notifier.notify(JSHelper.PAGE_SETUP_COMPLETE, {});
    });
    
    // Run!
    worldManager.loop();
}

// Call main in the next frame.
requestAnimationFrame(main);

