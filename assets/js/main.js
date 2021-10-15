$(function() {
  $(".input > #input").linenumbers();
  let isCodeCompiled = false;
  let Duck = new DuckDuino();
  let mods = new Modules().list;
  try {
    let isFileSaverSupported = !!new Blob();
  } catch (e) {}
  $(".input > #input").keyup(function() {
    $(".copy-but").prop("disabled", true);
    $(".export .copy-but").text("Copy Code To Clipboard !");
    $(".dl-but button").prop("disabled", true);
    $(".dl-but select").prop("disabled", true);
    if($(this).val() !== "") {
      $(".process-but button").prop("disabled", false);
      $(".process-but select").prop("disabled", false);
    } else {
      $(".process-but button").prop("disabled", true);
      $(".process-but select").prop("disabled", true);
    }
  });
  $(".copy-but").prop("disabled", true);
  $(".export .copy-but").text("Copy Code To Clipboard !");
  $(".dl-but button").prop("disabled", true);
  $(".dl-but select").prop("disabled", true);
  $(".process-but button").click(function() {
    let duckyScript = $(".input > #input").val();
    let selectedModule = mods[$(".process-but select").find(":selected").val()];
    let compilerOut = Duck.compileCode(duckyScript, selectedModule.module);
    if(compilerOut.returnCode === 0) {
      $(".export > textarea").val(compilerOut.compiledCode);
      $(".copy-but").prop("disabled", false);
      $(".export .copy-but").text("Copy Code To Clipboard !");
      $(".dl-but select").empty();
      $(".dl-but button").prop("disabled", true);
      $(".dl-but select").prop("disabled", true);
      for (let y in selectedModule.meta.locales) {
        let l = selectedModule.meta.locales[y];
        if (y == "_meta")
          continue;
        $(".dl-but select").append("<option value=\"" + y + "\">" + l.name + "</option>");
        $(".dl-but button").prop("disabled", false);
        $(".dl-but select").prop("disabled", false);
      }
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("error"); $(".process .tooltip").addClass("info");
      $(".process .tooltip").show();
    } else {
      $(".dl-but button").prop("disabled", true);
      $(".dl-but select").prop("disabled", true);
      $(".copy-but").prop("disabled", true);
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("info"); $(".process .tooltip").addClass("error");
      $(".process .tooltip").show();
    }
  });
  for (let x in mods) {
    let m = mods[x];
    $(".process-but select")
      .append("<option value=\"" + x + "\">" + m.meta.displayname + "</option>");
  }
  $(".dl-but button").click(function() {
    let compilerOut = $(".export > textarea").val();
    let sketchName = "Sketch";
    let zipHandler = new JSZip();
    zipHandler.file(sketchName + "/" + sketchName + ".ino", compilerOut);
    zipHandler.file("Readme.txt", $.ajax({
      url: 'readme.default',
      mimeType: 'text/plain',
      type: 'get',
      success: function(data) {return data;}
    }));
    let lib = "";
    let selectedModule = mods[$(".process-but select").find(":selected").val()];
    let selectedLocale = selectedModule.meta.locales[$(".dl-but select").find(":selected").val()];
    for (let x in selectedModule.meta.locales._meta.parts) {
      let p = selectedModule.meta.locales._meta.parts[x];
      if (p == '_locale_')
        lib += selectedLocale.data;
      else
        lib += p;
    }
    zipHandler.file(
      sketchName + "/" + selectedModule.meta.locales._meta.name + ".cpp", lib);
    zipHandler.file(
      sketchName + "/" + selectedModule.meta.locales._meta.name + ".h",
      selectedModule.meta.locales._meta.header);
    zipHandler.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, sketchName + ".zip");
      }
    );
  });
  $(".copy-but").click(function() {
    let copyTextarea = $(".export > textarea");
    copyTextarea.select();
    try {
      document.execCommand('copy');
      $(".copy-but").text("Code Copied !");
      $(".copy-but").prop("disabled", true);
    } catch (e) {/* Error */}
  });
});
