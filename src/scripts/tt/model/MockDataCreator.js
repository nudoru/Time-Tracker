define('tt/model/MockDataCreator',

  function (require, module, exports) {

    var _projectId            = 100,
        _assignmentId         = 1000,
        _personId             = 10,
        _people               = [],
        _projects             = [],
        _assignments          = [],
        _possibleManagers     = [],
        _possibleRoles        = ['Consult',
          'Analysis',
          'Design',
          'Develop',
          'Rework',
          'Implement',
          'Evaluate'],
        _possibleTasks        = ['Analysis', 'Design', 'Develop', 'Implement', 'Evaluate', 'Consult'],
        _possibleLobs         = ['Information Technology', 'Asset Management', 'Human Resources', 'Institutional', 'A&O', 'Client Services', 'Finance', 'Internal Audit', 'Marketing', 'Risk Management'],
        _possibleProjectTypes = ['pmo', 'category'],
        _lorem                = require('nudoru/browser/NLorem'),
        _arrayUtils           = require('nudoru/core/ArrayUtils'),
        _stringUtils          = require('nudoru/core/StringUtils'),
        _numberUtils          = require('nudoru/core/NumberUtils');

    function getPeople() {
      return _people;
    }

    function getProjects() {
      return _projects;
    }

    function getAssignments() {
      return _assignments;
    }

    function initialize() {

      _lorem.initialize();

      var numPeople      = 5,
          numProjects    = 50,
          numAssignments = 10;

      for (var a = 0; a < 10; a++) {
        _possibleManagers.push(_lorem.getFLName());
      }

      for (var i = 0; i < numPeople; i++) {
        _people.push(createMockPerson());
      }

      for (var j = 0; j < numProjects; j++) {
        _projects.push(createMockProject());
      }

      for (var k = 0; k < numAssignments; k++) {
        _assignments.push(createAssignment(_arrayUtils.rndElement(_people), _arrayUtils.rndElement(_projects)));
      }

      localStorage['mockTTData.people']      = JSON.stringify(_people);
      localStorage['mockTTData.projects']    = JSON.stringify(_projects);
      localStorage['mockTTData.assignments'] = JSON.stringify(_assignments);
    }

    function createMockPerson() {
      return {
        id             : (_personId++).toString(),
        name           : _lorem.getFLName(),
        manager        : _arrayUtils.rndElement(_possibleManagers),
        type           : 'type_b',
        team           : 'Dev Team',
        brlTeamManager : _arrayUtils.rndElement(_possibleManagers),
        brlSrLeader    : _arrayUtils.rndElement(_possibleManagers),
        jobTitle       : _arrayUtils.rndElement(_possibleRoles),
        primaryRole    : _arrayUtils.rndElement(_possibleTasks),
        secondaryRole  : _arrayUtils.rndElement(_possibleTasks),
        active         : 'Y',
        inActiveDate   : '',
        keySkills      : _arrayUtils.rndElement(_possibleTasks),
        comments       : 'No comments',
        photoURL       : 'img/animals/kowala.jpg',
        timeCardHistory: {},
      };
    }

    function createMockProject() {
      return {
        id            : (++_projectId).toString(),
        title         : '[p' + _projectId + '] ' + _stringUtils.toTitleCase(_lorem.getText(2, 6)),
        description   : getParas(2),
        status        : 'active',
        workType      : 'Develop',
        projectType   : _arrayUtils.rndElement(_possibleProjectTypes),
        requester     : _lorem.getFLName(),
        audience      : _arrayUtils.rndElement(_possibleLobs),
        audienceSize  : _numberUtils.rndNumber(10, 500).toString(),
        projectLead   : _lorem.getFLName(),
        startDate     : _lorem.getDate().string,
        endDate       : _lorem.getDate().string,
        deploymentDate: _lorem.getDate().string,
        finishDate    : _lorem.getDate().string,
        comments      : getParas(1),
        teamLeading   : 'Dev Team',
        duration      : _numberUtils.rndNumber(1, 5).toString()
      };
    }

    function createAssignment(person, project) {
      return {
        id                : (++_assignmentId).toString(),
        resourceID        : person.id,
        resourceName      : person.name,
        active            : true,
        projectID         : project.id,
        projectTitle      : '[a' + _assignmentId + '] ' + project.title,
        projectDescription: project.description,
        projectType       : project.projectType,
        startDate         : '',
        endDate           : '',
        role              : person.primaryRole,
        allocation        : '10',
        timeCardData      : {}
      };
    }

    function getParas(max) {
      var para    = '',
          numPara = _numberUtils.rndNumber(1, max),
          i       = 0;

      for (; i < numPara; i++) {
        para += '<p>' + _lorem.getParagraph(3, 7) + '</p>';
      }

      return para;
    }

    module.exports.initialize       = initialize;
    module.exports.getPeople        = getPeople;
    module.exports.getProjects      = getProjects;
    module.exports.getAssignments   = getAssignments;
    module.exports.createAssignment = createAssignment;

  });