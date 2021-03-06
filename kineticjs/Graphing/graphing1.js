  function addListener(element, event, callback){
    element.on(event, callback);
    listeners.push(function(){ element.off(event, callback) });
  }


  function createText(x, y, text, fontsize){
    return new Kinetic.Text({
      x: x,
      y: y,
      stroke: "green",
      strokeWidth: 5,
      fill: "#ddd",
      text: text,
      fontSize: fontsize,
      fontFamily: "Calibri",
      textFill: "#888",
      textStroke: "#444",
      padding: 15,
      align: "center",
      verticalAlign: "middle"
    });
  }


  function DoStuffForGraph1() {
    listeners = [];
    var WIN;
    var stage = new Kinetic.Stage("container", 800, 800);
    var layer = new Kinetic.Layer();
    var lineLayer = new Kinetic.Layer();
    var complexText = new Array();
    var statements = [ "Yes!", "Find the peak of the mountain!", "Radical!", "Totally Rhombus!", "Mathematical!",
                       "Along the Y-axis", "The river flows downhill.", "That is illogical.",
                       "Order These Boxes", "Look for the edge." ];

    //Make the Text fields.
    for (var i = 0; i < 10; i++) {
      complexText[i] = createText(Math.random()*(stage.width-200)+100,  Math.random()*(stage.height-200)+100, statements[i], 15)
      complexText[i].draggable(true);
      layer.add(complexText[i]);
    }

    //link the text fields together
    for (var i = 0; i < 10; i++) {
      if (i - 1 >= 0) {
        complexText[i].before = complexText[i - 1];
      }
      if (i + 1 < 10) {
        complexText[i].next = complexText[i + 1];
      }
      //Redraw lines
      addListener(complexText[i], "dragmove", function() {
        Graph1drawLine(this, complexText, lineLayer);

        //check for win state
        var checkWin = CheckOrder(complexText);
        console.log(checkWin);
        if (Math.abs(checkWin) === Math.abs(complexText.length - 1))
          winstate(WIN, layer);
      });
    }

    // add the layer to the stage
    stage.add(lineLayer);
    stage.add(layer);
  };


  //Draw lines (just like in the flower tutorial)


  function Graph1drawLine(complexText, Text, lineLayer) {
    var stage = complexText.getStage();
    var context = lineLayer.getContext();

    if (complexText.before == undefined) complexText.before = complexText;
    if (complexText.next == undefined) complexText.next = complexText;

    context.save();
    context.beginPath();
    lineLayer.clear();
    context.strokeStyle = "green";
    context.lineWidth = 10;

    context.moveTo(complexText.before.x, complexText.before.y);
    context.lineTo(complexText.x, complexText.y);
    context.lineTo(complexText.next.x, complexText.next.y);

    context.stroke();
    context.closePath();
    context.restore();
  }

/*      addListener(complexText[i], "dragend", function() {
        var checkWin = CheckOrder(complexText);
        console.log(checkWin);
        if (Math.abs(checkWin) === Math.abs(complexText.length - 1)) {
          // -9 or 9?  then move //yes, it's a little bug
*/
        function winstate(WIN, layer){
          WIN = createText(400,  130, "WIN!", 200);
          WIN.draggable(true);
          layer.add(WIN);
          addListener(WIN, "mousedown", function() {
            killall(WIN); //DoStuffForGraph1();
          });
        }

  //check if everything has been lined up properly


  function CheckOrder(Text) {
    var counter = 0;
    for (var i = 0; i < Text.length - 1; i++) {
      if (Text[i].next.y > Text[i].y) counter++;
      else counter--;
    }
    return counter;
  }


  function killall(winToken) {
    var stage = winToken.getStage();
    stage.stop();
    stage.clear();
    listeners.forEach(Function.call.bind(Function.call));
    listeners = [];
    $("#container").empty();
    if(counterfunctionIndex<counterfunction.length-1)counterfunctionIndex++;
    counterfunction[counterfunctionIndex]();
  }
