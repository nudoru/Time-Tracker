APP.createNameSpace('APP.AppController.ViewChangedCommand');
APP.AppController.ViewChangedCommand = APP.AppController.createCommand(APP.AppController.AbstractCommand);
APP.AppController.ViewChangedCommand.execute = function(data) {
  DEBUGGER.log('ViewChangedCommand: '+data);
};