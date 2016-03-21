'use strict';

(function() {

    class weekViewController {

        constructor($http, $scope, socket, $cookies) {
            this.$http = $http;
            this.awesomeEvents = [];

            this.calendar;
            this.url = window.location;
            this.user;
            this.$scope = $scope;
            this.$scope.slot = this.calendar;
            $scope.events = [];
            
           
            //get calendar id from user ----------------------------
            paramSerializer: '$httpParamSerializerJQLike';
/*
            if (!$rootScope.userIDglobal) {
                console.log("do nothing");
                //  window.location = window.location + "/" +  $rootScope.userIDglobal;
            } else {
                //  $rootScope.userIDglobal  = this.userIDtemp ;
            }
*/
            //send request to BE to get user and then call method to get calendar------------------------------------
            if ($cookies.get("userId")) {
                $http.get('/api/users/' + $cookies.get("userId")).then(response => {
                    this.user = response.data;
                    this.getCalendar();
                    socket.syncUpdates('calendar', this.calendar);
                });
                } else {
                console.log("ERROR - userID is undefined. please use the link that was provided to you when the calendar was created.");
            }

            //autogenerated code --------------------------------------
            $scope.$on('$destroy', function() {
                socket.unsyncUpdates('calendar');
            });
        }

        //send request to BE to get calendar details -------------------------------
        getCalendar() {
            this.$http.get('/api/calendars/' + this.user.calID).then(response => {
                this.calendar = response.data;
                this.calendar.events.sort(this.sortTime);
                this.weekEvents();
            });
        }


        weekEvents() {

            if (this.calendar.events.length == 0) {
                this.$scope.calendarView = 'week';
                this.$scope.calendarDateDay = new Date();
                console.log("HELLO ITS ME");
            }
            else {
                for (var i in this.calendar.events) {
                    var calEvent = this.calendar.events[i].date;
                    var startTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].startTime);
                    var endTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].endTime);

                    var shortStartDate = this.calendar.events[i].startTime + "";
                    var shortEndDate = this.calendar.events[i].endTime + "";
                    var hourStart = shortStartDate.substring(0, 5);
                    var hourEnd = shortEndDate.substring(0, 5);
                
                    // Required to set the calendar months or day
                    this.$scope.calendarView = 'week';
                    this.$scope.calendarDateDay = new Date();

                    console.log("ID:" + this.calendar.events[i]._id);
                    this.$scope.events[i] =
                        {
                            title: hourStart + "-" + hourEnd + ' ' + this.calendar.events[i].title,
                            startsAt: new Date(moment(startTime).format()),
                            endsAt: new Date(moment(endTime).format()),
                            eventId: this.calendar.events[i]._id
                        };
                }
            }
        }

        private sortTime(date1, date2): any {		

            //Sort By Time		
            if (date1.startTime > date2.startTime) return 1;
            if (date1.startTime < date2.startTime) return -1;
            return 0;
        }
    }
    

    angular.module('takeTurnsApp')
        .controller('weekViewController', weekViewController);

})();
