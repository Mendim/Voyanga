/**
 * Created with JetBrains PhpStorm.
 * User: oleg
 * Date: 14.09.12
 * Time: 14:40
 * To change this template use File | Settings | File Templates.
 */


VoyangaCalendarTimeline = new VoyangaCalendarClass({jObj:'#voyanga-calendar-timeline',values:new Array(),twoSelect: true});
VoyangaCalendarTimeline.slider = new VoyangaCalendarSlider({
    init: function(){
        //console.log(this.monthArray);
        console.log(this.jObj);
        if(typeof this.jObj == 'string'){
            this.jObj = $(this.jObj);
        }
        var self = this;
        for(var i in this.monthShowArray){
            var leftPercent = this.monthShowArray[i].line / (this.totalShowLines - this.linesWidth);
            leftPercent =  Math.round((1 - (this.linesWidth / this.totalShowLines) )*leftPercent*1000 )/10;
            if(i < (this.monthShowArray.length - 1) ){
                var k=parseInt(i)+1;

                var widthPercent = (this.monthShowArray[k].line - this.monthShowArray[i].line) / this.totalShowLines;
                //var widthPercent = 4/(VoyangaCalendar.slider.totalLines);
            }else{
                var widthPercent = (this.totalShowLines - this.monthShowArray[i].line) / this.totalShowLines;
            }
            widthPercent = Math.round(widthPercent*1000)/10;

            var newHtml = '<div class="monthNameVoyanga" style="left: '+leftPercent+'%; width: '+widthPercent+'%"><div class="monthWrapper">'+this.monthShowArray[i].name+'</div></div>';
            this.jObj.find('.monthLineVoyangaYear').append(newHtml);
        }
        var monthLineWidth = Math.round(((this.totalLines) / this.totalShowLines)*10000)/100;
        this.jObj.find('.monthLineVoyanga').css('width',monthLineWidth + '%');
        for(var i in this.monthArray){
            var leftPercent = this.monthArray[i].line / (this.totalLines - this.linesWidth);
            leftPercent =  Math.round((1 - (this.linesWidth / this.totalLines) )*leftPercent*1000 )/10;
            if(i < (this.monthArray.length - 1) ){
                var k=parseInt(i)+1;

                var widthPercent = (this.monthArray[k].line - this.monthArray[i].line) / this.totalLines;
                //var widthPercent = 4/(VoyangaCalendar.slider.totalLines);
            }else{
                var widthPercent = (this.totalLines - this.monthArray[i].line) / this.totalLines;
            }
            widthPercent = Math.round(widthPercent*1000)/10;

            var newHtml = '<div class="monthNameVoyanga" style="left: '+leftPercent+'%; width: '+widthPercent+'%"><div class="monthWrapper">'+this.monthArray[i].name+'</div></div>';
            //this.jObj.find('.monthLineVoyanga').append(newHtml);
        }
        console.log('tl:',this.totalLines);
        this.knobWidth = Math.round(((this.linesWidth) / this.totalLines)*10000)/100;
        this.jObj.find('.knobVoyanga').css('width',this.knobWidth + '%');
        this.jObj.find('.knobUpAllMonth').css('width',this.knobWidth + '%');
        //VoyangaCalendar.slider.width = VoyangaCalendar.jObj.find('.monthLineVoyanga').width();
        $(window).on('resize',function(){self.onresize();});
        $(window).load(function(){self.onresize();self.knobMove();});

        this.jObj.find('.calendarGridVoyanga').on('scroll',function(e){self.scrollEvent(e);});
        //console.log('set wheel actions2');
        this.jObj.find('.calendarGridVoyanga').on('mousewheel',function (e){self.mousewheelEvent(e);
            if(e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        });
        this.jObj.find('.calendarGridVoyanga').on('DOMMouseScroll',function (e){self.mousewheelEvent(e);
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        });
        this.jObj.find('.monthLineWrapper').mousedown(function(e){self.mouseDown(e);});
        this.jObj.find('.monthLineWrapper').mouseup(function(e){self.mouseUp(e);});
        //VoyangaCalendar.jObj.find('.monthLineVoyanga .monthNameVoyanga').mouseup(VoyangaCalendar.slider.monthMouseUp);
        this.jObj.find('.monthLineVoyanga .monthNameVoyanga .monthWrapper').mouseup(function(e){var obj = this;self.monthMouseUp(obj,e);});
        this.jObj.find('.monthLineWrapper').MouseDraggable({
            startEvent: function (e,obj){self.startEvent(e,obj);},
            endEvent: function (e,obj){self.endEvent(e,obj);},
            dragEvent: function (e,obj){self.dragEvent(e,obj);}
        });
    },
    linesWidth:3
});
console.log(this.jObj);
VoyangaCalendarTimeline.onCellOver = function(obj,e){
    /*var jCell = $(obj);
    if(!jCell.hasClass('inactive')){
        var cellDate = Date.fromIso(jCell.data('cell-date'));
        if(this.values.length == 1){
            if(cellDate < this.values[0]){
                jCell.addClass('from');
            }else{
                if(this.twoSelect){
                    jCell.addClass('to');
                }else{
                    jCell.addClass('from');
                }
            }

        }else{
            jCell.addClass('from');
        }
        if(cellDate.getDate() == 1){
            jCell.addClass('startMonth');
        }
    }*/
}
VoyangaCalendarTimeline.onCellOut = function(obj,e){
    /*var jCell = $(obj);
    if(!jCell.hasClass('inactive')){
        var cellDate = Date.fromIso(jCell.data('cell-date'));
        if(this.values.length == 1){
            if(cellDate < this.values[0]){
                jCell.removeClass('from');
            }else{
                if(this.twoSelect){
                    jCell.removeClass('to');
                }else{
                    jCell.removeClass('from');
                }
            }

        }else{
            jCell.removeClass('from');
        }
        if(cellDate.getDate() == 1){
            jCell.removeClass('startMonth');
        }
        if(this.values.length > 0){
            if(this.values[0].valueOf() == cellDate.valueOf()){
                jCell.addClass('selectData from');
                if(cellDate.getDate() == 1){
                    jCell.addClass('startMonth');
                }
            }
        }
        if(this.values.length > 1){
            if(this.values[1].valueOf() == cellDate.valueOf()){
                jCell.addClass('selectData to');
                if(cellDate.getDate() == 1){
                    jCell.addClass('startMonth');
                }
            }
        }
    }*/
}
VoyangaCalendarTimeline.getCellByDate = function(oDate){
    var dateLabel = oDate.getFullYear()+'-'+(oDate.getMonth()+1)+'-'+oDate.getDate();
    return $('#dayCell-'+dateLabel);
}
VoyangaCalendarTimeline.onCellClick = function(obj,e){
    /*var jCell = $(obj);
    if(!jCell.hasClass('inactive')){
        var cellDate = Date.fromIso(jCell.data('cell-date'));
        if(this.twoSelect){
            if(this.values.length == 2){

                this.getCellByDate(this.values[0]).removeClass('selectData from startMonth');
                var tmpDate = new Date(this.values[0].toDateString());
                tmpDate.setDate(tmpDate.getDate()+1);
                while(tmpDate < this.values[1]){
                    this.getCellByDate(tmpDate).removeClass('selectDay');
                    tmpDate.setDate(tmpDate.getDate()+1);
                }

                this.getCellByDate(this.values[1]).removeClass('selectData to startMonth');
                this.values = new Array();
            }else if(this.values.length == 1){

                if(cellDate < this.values[0]){
                    this.getCellByDate(this.values[0]).removeClass('selectData from startMonth');
                    this.values = new Array();
                }else{
                    this.values.push(cellDate);
                    jCell.addClass('selectData to');
                    if(cellDate.getDate() == 1){
                        jCell.addClass('startMonth');
                    }
                    var tmpDate = new Date(this.values[0].toDateString());
                    tmpDate.setDate(tmpDate.getDate()+1);
                    while(tmpDate < this.values[1]){
                        this.getCellByDate(tmpDate).addClass('selectDay');
                        tmpDate.setDate(tmpDate.getDate()+1);
                    }
                }

            }
        }else{
            if(this.values.length == 1){
                this.getCellByDate(this.values[0]).removeClass('selectData from startMonth');
                this.values = new Array();
            }
        }
        if(this.values.length == 0){
            this.values.push(cellDate);
            jCell.addClass('selectData from');
            if(cellDate.getDate() == 1){
                jCell.addClass('startMonth');
            }
        }
    }*/
}
VoyangaCalendarTimeline.generateGrid = function(){
    var startMoment = moment(this.minDate);
    var endMoment = moment(this.maxDate);
    console.log('dates',this.minDate,this.maxDate);
    var firstDay = this.minDate;
    //var firstDay = new Date('2012-04-10');
    var dayToday = new Date();
    dayToday.setMinutes(0,0,0);
    dayToday.setHours(0);
    //dayToday.setSeconds(0);

    var self = this;


    var startMonth = firstDay.getMonth();
    var tmpDate = moment(startMoment)._d;
    //var diff = endMoment.diff(startMoment,'days');
    var weekDiff  = this.getDay(this.maxDate) - this.getDay(this.minDate);
    var dateDiff = Math.floor(endMoment.diff(startMoment,'days',true));
    console.log('diff',weekDiff,dateDiff);
    if(weekDiff == dateDiff){
        console.log(tmpDate);
        tmpDate.setDate(tmpDate.getDate() - 7);
        console.log(tmpDate);
    }

    //tmpDate.setDate(1);
    var weekDay = this.getDay(tmpDate);
    //console.log(weekDay);
    var startDate = firstDay.getDate();
    var startYear = firstDay.getFullYear();
    //console.log(tmpDate);
    tmpDate.setDate(tmpDate.getDate()-this.getDay(tmpDate));

    //tmpDate.setDate(0);
    //console.log(tmpDate);
    var needStop = false;
    var lineNumber = 0;
    var fullYear  = false;
    this.slider.monthArray = new Array();
    this.slider.monthShowArray = new Array();
    while((!needStop) || (!fullYear))
    {
        if(!needStop){
            var newHtml = '<div class="calendarLineVoyanga" id="weekNum-'+lineNumber+'" data-weeknum="'+lineNumber+'">';
            for(var i=0;i<7;i++){

                var label = '<div class="dayLabel'+((i>=5 && i<7) ? ' weekEnd' : '')+'">'+tmpDate.getDate()+'</div>';


                if(tmpDate.getDate() == 1){
                    label = label + ' <div class="monthLabel">' + this.monthNames[tmpDate.getMonth()] +'</div>';
                    var monthObject = new Object();
                    monthObject.line = lineNumber;
                    monthObject.name = this.monthNames[tmpDate.getMonth()];
                    this.slider.monthArray.push(monthObject);
                    this.slider.monthShowArray.push(monthObject);
                }
                var dateLabel = tmpDate.getFullYear()+'-'+(tmpDate.getMonth()+1)+'-'+tmpDate.getDate();
                newHtml = newHtml + '<div class="dayCellVoyanga'+((tmpDate < dayToday) ? ' inactive' : '')+((i>=5 && i<7) ? ' weekEnd' : '')+'" id="dayCell-'+dateLabel+'" data-cell-date="'+dateLabel+'"><div class="innerDayCellVoyanga">'+label+'</div></div>';
                tmpDate.setDate(tmpDate.getDate()+1);
            }
            newHtml = newHtml + '</div>';
            this.jObj.find('.calendarDIVVoyanga').append(newHtml);
            if(tmpDate > this.maxDate && lineNumber >= 2){
                //if(tmpDate.getMonth() >= startMonth ){
                    needStop = true;
                    var lastLineNumber = lineNumber + 1;
                //}
            }
        }else{
            for(var i=0;i<7;i++){
                if(tmpDate.getDate() == 1){
                    var monthObject = new Object();
                    monthObject.line = lineNumber;
                    monthObject.name = this.monthNames[tmpDate.getMonth()];
                    this.slider.monthShowArray.push(monthObject);
                }
                tmpDate.setDate(tmpDate.getDate()+1);
            }
        }

        if(tmpDate.getFullYear() > startYear){
            if(tmpDate.getMonth() >= startMonth ){
                needStop = true;
                fullYear = true;
            }
        }
        //if(lineNumber > 4){
        //needStop = true;
        //}
        lineNumber++;
    }
    console.log('monthArr', this.slider.monthArray.length,this.slider.monthArray);
    if(this.slider.monthArray.length == 0){
        var monthObject = new Object();
        monthObject.line = 0;
        tmpDate.setMonth(tmpDate.getMonth() + 1);
        monthObject.name = this.monthNames[tmpDate.getMonth()];
        this.slider.monthArray.push(monthObject);
    }
    var lastLineMonth = this.slider.monthArray[this.slider.monthArray.length - 1].line;

    //console.log(this.slider.monthArray);
    if((lastLineNumber - lastLineMonth) < 2 && this.slider.monthArray.length > 9){
        this.slider.monthArray.pop();
    }

    var lastLineMonth = this.slider.monthShowArray[this.slider.monthShowArray.length - 1].line;
    //console.log(this.slider.monthArray);
    if((lineNumber - lastLineMonth) < 2){
        this.slider.monthShowArray.pop();
    }
    /*this.jObj.find('.dayCellVoyanga').on('mouseover',function (e) {var obj = this; self.onCellOver(obj,e);});
     this.jObj.find('.dayCellVoyanga').on('mouseout',function (e) {var obj = this; self.onCellOut(obj,e);});*/
    this.jObj.find('.dayCellVoyanga').hover(function (e) {var obj = this; self.onCellOver(obj,e);},function (e) {var obj = this; self.onCellOut(obj,e);});
    this.jObj.find('.dayCellVoyanga').on('click',function (e) {var obj = this; self.onCellClick(obj,e);});

    this.slider.totalLines = lastLineNumber;
    this.slider.totalShowLines = lineNumber;
    console.log(this.slider.totalLines);
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
VoyangaCalendarTimeline.calendarEvents = new Array();

VoyangaCalendarTimeline.eventsCompareFunction = function (a, b) {
    if (a.dayStart < b.dayStart) {
        return -1;
    } else if (a.dayStart > b.dayStart) {
        return 1;
    } else {
        if ((a.type == 'flight') && (b.type == 'hotel')) {
            return -1;
        } else if ((a.type == 'hotel') && (b.type == 'flight')) {
            return 1;
        } else {
            return 0;
        }
    }
}


VoyangaCalendarTimeline.generateStartPoint = function (FirstEvent) {
    var totalDays = FirstEvent.dayEnd.valueOf() - FirstEvent.dayStart.valueOf();
    totalDays = Math.round(totalDays / (3600 * 24 * 1000));
    if (totalDays == 0) {
        totalDays = 1;
    }
    var dayWidth = this.dayCellWidth;
    //var outHtml = '<div class="startYourTours" style="width: ' + (dayWidth * totalDays) + '%">';
    var outHtml = '<div class="startYourTours">';
    outHtml = outHtml + '</div>';
    return outHtml;
}

VoyangaCalendarTimeline.generateEndPoint = function (LastEvent) {
    var totalDays = LastEvent.dayEnd.valueOf() - LastEvent.dayStart.valueOf();
    totalDays = Math.round(totalDays / (3600 * 24 * 1000));
    if (totalDays == 0) {
        totalDays = 1;
    }
    var dayWidth = this.dayCellWidth;
    //var outHtml = '<div class="endYourTours" style="width: ' + (dayWidth * totalDays) + '%">';
    totalDays = totalDays % 7;
    var outHtml = '<div class="endYourTours" style="left: ' + (dayWidth * totalDays) + '%">';
    outHtml = outHtml + '</div>';
    return outHtml;
}

VoyangaCalendarTimeline.generateHotelDiv = function (HotelEvent) {
    var totalDays = HotelEvent.dayEnd.valueOf() - HotelEvent.dayStart.valueOf();
    totalDays = Math.round(totalDays / (3600 * 24 * 1000));
    if (totalDays == 0) {
        totalDays = 1;
    }
    console.log(totalDays);
    var dayWidth = this.dayCellWidth;
    var deltaLeft = (dayWidth / HotelEvent.startInfo.count)*(0.5);
    var deltaRight = (dayWidth / HotelEvent.endInfo.count)*(0.5);
    //var deltaWidth = deltaRight - deltaLeft;
    var setWidth = dayWidth * totalDays - dayWidth + 0.1 + (deltaLeft + deltaRight);
    var outHtml = '<div class="yourTrip" style="width: ' + (setWidth) + '%" data-delta-left="'+deltaLeft+'">';
    outHtml = outHtml + '<div class="startHotel"></div>';
    outHtml = outHtml + '<div class="pathHotel"></div><div class="endHotel"></div>';
    outHtml = outHtml + '<div class="nameHotel">' + HotelEvent.description + '</div>';
    outHtml = outHtml + '</div></div>';

    //outHtml = '<div class="yourTrip"><div class="startHotel"></div><div class="pathHotel"></div><div class="endHotel"></div><div class="nameHotel" style="color: rgb(234, 239, 243); position: absolute; top: 49px; z-index: 210; left: 16px;">Рэдиссон Соня Отель, Амстердам</div></div>';
    return outHtml;
}

VoyangaCalendarTimeline.generateFlightDiv = function (FlightEvent) {
    var totalDays = FlightEvent.dayEnd.valueOf() - FlightEvent.dayStart.valueOf();
    totalDays = Math.floor(totalDays / (3600 * 24 * 1000));
    //console.log('generate flight div');

    //console.log(FlightEvent);
    totalDays = totalDays + 1;
    /*if(totalDays == 0){
     totalDays = 1;
     }*/
    //console.log(totalDays);
    //console.log(totalDays);
    var dayWidth = this.dayCellWidth;
    //console.log(dayWidth);
    var names = FlightEvent.description.split('||');



    switch (totalDays){
        case 1:
            var jetFlyClass = '';
            var imgPath = '/themes/v2/images/trip-line-01.png';
            var flyTripClass = 'flyTrip fd1';

            break;
        case 2:
            var jetFlyClass = ' twoDays';
            var imgPath = '/themes/v2/images/trip-line-02.png';
            var flyTripClass = 'flyTrip fd2';

            break;
        case 3:
            var jetFlyClass = ' threeDays';
            var imgPath = '/themes/v2/images/trip-line-03.png';
            var flyTripClass = 'flyTrip fd3';

            break;
    }

    if(totalDays == 1 && FlightEvent.startInfo.position == FlightEvent.endInfo.position){
        if(false && FlightEvent.startInfo.point || FlightEvent.startInfo.point){
            var deltaLeft = (dayWidth / FlightEvent.startInfo.count)*(0.5 + FlightEvent.startInfo.position);
            var outHtml = '<div class="flyTrip" style="width: 0%" data-delta-left="'+deltaLeft+'">';
            outHtml = outHtml + '<div class="startYourTours"></div></div>';
            return outHtml;
        }
        return '';
    }
    var deltaLeft = (dayWidth / FlightEvent.startInfo.count)*(0.5 + FlightEvent.startInfo.position);
    var deltaRight = (totalDays-1)*dayWidth + (dayWidth / FlightEvent.endInfo.count)*(0.5 + FlightEvent.endInfo.position);
    console.log('flightDiv',deltaLeft,deltaRight)
    var deltaWidth = deltaRight - deltaLeft;
    if(FlightEvent.startInfo.count == 3){
        names[0] = FlightEvent.cityFrom;
    }
    if(FlightEvent.endInfo.count == 3){
        names[1] = FlightEvent.cityTo;
    }


    var outHtml = '<div class="'+flyTripClass+'" style="width: ' + (deltaWidth) + '%" data-delta-left="'+deltaLeft+'">';
    outHtml = outHtml + (FlightEvent.startInfo.point ? '<div class="startYourTours"></div>' : '');
    outHtml = outHtml + '<div class="tripFlyAll"><div class="jetFly'+jetFlyClass+'" style="top: 4px;"></div><img width="100%" height="40" src="'+imgPath+'"></div>';
    outHtml = outHtml + (FlightEvent.startInfo.city ? '<div class="startNameCity">' + names[0] + '</div>' : '');
    outHtml = outHtml + (FlightEvent.endInfo.city ? '<div class="endNameCity">' + names[1] + '</div>' : '');
    outHtml = outHtml + (FlightEvent.endInfo.point ? '<div class="endYourTours"></div>' : '');
    outHtml = outHtml + '</div>';
    return outHtml;
}

VoyangaCalendarTimeline.generateEvents = function () {
    this.dayCellWidth = this.jObj.find('.dayCellVoyanga:first').width() + 2;
    this.dayCellWidth = 14.2;//14.28;
    var self = this;
    //Need width %
    var eventDays = {};
    // код ниже представляет из себя ужасное безобразие
    // необходимое для того, чтобы корректно можно было
    // отобразить несколько событий в один день
    //
    //

    //цикл в котором пробегаемся по всем событиям и группируем их по дням и типам событий
    for (var i in this.calendarEvents) {
        var dt = this.calendarEvents[i].dayStart;
        var dateLabel = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        if(typeof eventDays[dateLabel] != 'object'){
            eventDays[dateLabel] = {types: {}, count: 0};
        }

        if(typeof eventDays[dateLabel].types[this.calendarEvents[i].type] != 'object'){
            eventDays[dateLabel].types[this.calendarEvents[i].type] = {s: new Array(), e: new Array()};
        }
        eventDays[dateLabel].types[this.calendarEvents[i].type].s.push(i);
        eventDays[dateLabel].count++;


        var dt = this.calendarEvents[i].dayEnd;
        var dateLabel = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();

        if(typeof eventDays[dateLabel] != 'object'){
            eventDays[dateLabel] = {types: {}, count: 0};
        }

        if(typeof eventDays[dateLabel].types[this.calendarEvents[i].type] != 'object'){
            eventDays[dateLabel].types[this.calendarEvents[i].type] = {s: new Array(), e: new Array()};
        }
        eventDays[dateLabel].types[this.calendarEvents[i].type].e.push(i);
        eventDays[dateLabel].count++;
    }
    console.log('eventDays',eventDays);

    // а этот цикл необходим чтобы понять сколько точек будет отображено в обрабатываемом дне
    for(var key in eventDays){
        var endIds = {};
        var startIds = {};
        var dateLabel = key;
        var startCity = '';
        var endCity = '';
        var centerCities = new Array();
        var startShowPoint = true;
        var endShowPoint = true;
        var pointsObject = {startPoints: [],centerPoints:{s:[],e:[]},endPoints: []}

        if(typeof eventDays[dateLabel].types['hotel'] == 'object'){
            for(var fIndS in eventDays[dateLabel].types['hotel'].s){
                //Если найден отлель который начинается в этот день, то это последняя точка в текущем дне
                sInd = eventDays[dateLabel].types['hotel'].s[fIndS];
                pointsObject.endPoints.push(sInd);
                endCity = this.calendarEvents[sInd].city;
                endShowPoint = false;
                break;
            }
            for(var fIndE in eventDays[dateLabel].types['hotel'].e){
                //Если найден отлель который заканчивается в этот день, то это первая точка в текущем дне
                eInd = eventDays[dateLabel].types['hotel'].e[fIndE];
                pointsObject.startPoints.push(eInd);
                startCity = this.calendarEvents[eInd].city;
                startShowPoint = false;
                break;
            }
        }
        if(typeof eventDays[dateLabel].types['flight'] == 'object'){

            eventDays[dateLabel].types['flight'].s.sort(function(left,right){
                if(self.calendarEvents[left].sortInd > self.calendarEvents[right].sortInd)
                    return 1;
                if(self.calendarEvents[left].sortInd < self.calendarEvents[right].sortInd)
                    return -1;
                return 0;
            });
            eventDays[dateLabel].types['flight'].e.sort(function(left,right){
                if(self.calendarEvents[left].sortInd > self.calendarEvents[right].sortInd)
                    return -1;
                if(self.calendarEvents[left].sortInd < self.calendarEvents[right].sortInd)
                    return 1;
                return 0;
            });
            for(var fIndS in eventDays[dateLabel].types['flight'].s){
                sInd = eventDays[dateLabel].types['flight'].s[fIndS];
                if(startCity && this.calendarEvents[sInd].cityFrom == startCity){
                    pointsObject.startPoints.push(sInd);
                    this.calendarEvents[sInd].startInfo.point = false;
                }else if(!startCity){
                    startCity = this.calendarEvents[sInd].cityFrom;
                    pointsObject.startPoints.push(sInd);
                    this.calendarEvents[sInd].startInfo.point = true;
                }else if(endCity && this.calendarEvents[sInd].cityFrom == endCity){
                    pointsObject.endPoints.push(sInd);
                    this.calendarEvents[sInd].startInfo.point = false;
                }else{
                    pointsObject.centerPoints.s.push(sInd);
                    if(centerCities.indexOf(this.calendarEvents[sInd].cityFrom) == -1){
                        centerCities.push(this.calendarEvents[sInd].cityFrom);
                    }
                }

            }
            for(var fIndE in eventDays[dateLabel].types['flight'].e){
                eInd = eventDays[dateLabel].types['flight'].e[fIndE];
                if(endCity && this.calendarEvents[eInd].cityTo == endCity){
                    pointsObject.endPoints.push(eInd);
                    this.calendarEvents[eInd].endInfo.point = false;
                }else if(!endCity){
                    if(centerCities.length == 0 && startCity == this.calendarEvents[eInd].cityTo){
                        pointsObject.startPoints.push(eInd);
                    }else{
                        endCity = this.calendarEvents[eInd].cityTo;
                        pointsObject.endPoints.push(eInd);
                        this.calendarEvents[eInd].endInfo.point = true;
                    }
                }else if(startCity && this.calendarEvents[eInd].cityTo == startCity){
                    pointsObject.startPoints.push(eInd);
                    this.calendarEvents[eInd].endInfo.point = false;
                }else{
                    pointsObject.centerPoints.e.push(eInd);
                    if(centerCities.indexOf(this.calendarEvents[eInd].cityTo) == -1){
                        centerCities.push(this.calendarEvents[eInd].cityTo);
                    }
                }
            }
        }
        var count = 0;
        if(pointsObject.startPoints.length > 0){
            var startPosition = count;
            count++;
        }
        if((pointsObject.centerPoints.s.length + pointsObject.centerPoints.e.length) > 0){
            var centerPosition = count;
            count++;
        }
        if(pointsObject.endPoints.length > 0){
            var endPosition = count;
            count++;
        }
        var needShowCity = true;
        var needShowPoint = startShowPoint;
        for(var iInd in pointsObject.startPoints){
            sInd = pointsObject.startPoints[iInd];
            if(this.calendarEvents[sInd].type == 'hotel'){
                this.calendarEvents[sInd].endInfo.count = count;
                this.calendarEvents[sInd].endInfo.position = startPosition;
            }else{
                if (this.calendarEvents[sInd].startInfo.dateLabel == dateLabel ){
                    var infoKey = 'startInfo';
                }else{
                    var infoKey = 'endInfo';
                }
                this.calendarEvents[sInd][infoKey].count = count;
                this.calendarEvents[sInd][infoKey].position = startPosition;
                this.calendarEvents[sInd][infoKey].point = needShowPoint;
                this.calendarEvents[sInd][infoKey].city = needShowCity;
                needShowCity = false;
                needShowPoint = false;
            }
        }
        var needShowCity = centerCities.length == 1;
        var needShowPoint = true;
        for(var iInd in pointsObject.centerPoints.s){
            sInd = pointsObject.centerPoints.s[iInd];

            this.calendarEvents[sInd].startInfo.count = count;
            this.calendarEvents[sInd].startInfo.position = centerPosition;
            this.calendarEvents[sInd].startInfo.point = needShowPoint;
            this.calendarEvents[sInd].startInfo.city = needShowCity;
            needShowPoint = false;
            needShowCity = false;
        }
        if(centerCities.length > 1){
            this.calendarEvents[sInd].startInfo.point = true;
        }
        for(var iInd in pointsObject.centerPoints.e){
            sInd = pointsObject.centerPoints.e[iInd];

            this.calendarEvents[sInd].endInfo.count = count;
            this.calendarEvents[sInd].endInfo.position = centerPosition;
            this.calendarEvents[sInd].endInfo.point = needShowPoint;
            this.calendarEvents[sInd].endInfo.city = needShowCity;
            needShowPoint = false;
            needShowCity = false;
        }
        var needShowCity = true;
        var needShowPoint = endShowPoint;
        for(var iInd in pointsObject.endPoints){
            sInd = pointsObject.endPoints[iInd];
            if(this.calendarEvents[sInd].type == 'hotel'){
                this.calendarEvents[sInd].startInfo.count = count;
                this.calendarEvents[sInd].startInfo.position = endPosition;
            }else{
                this.calendarEvents[sInd].endInfo.count = count;
                this.calendarEvents[sInd].endInfo.position = endPosition;
                this.calendarEvents[sInd].endInfo.point = needShowPoint;
                this.calendarEvents[sInd].endInfo.city = needShowCity;
                needShowPoint = false;
                needShowCity = false;
            }
        }


    }
    console.log('eventDays',eventDays);
    console.log('calendarEvents',this.calendarEvents);

    var firstElem = true;
    var lastId = 0;
    var lastLeft = 0;
    for (var i in this.calendarEvents) {
        var dt = this.calendarEvents[i].dayStart;
        var dateLabel = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
        //console.log(dateLabel);

        var weekObj = this.jObj.find('#dayCell-' + dateLabel).parent();
        var weekNum = weekObj.data('weeknum');
        //console.log(weekNum);
        var tmpDate = new Date(dt.toString());
        //console.log(tmpDate);
        //return;
        var eventLength = this.calendarEvents[i].dayEnd.valueOf() - this.calendarEvents[i].dayStart.valueOf();

        var dayWidth = this.dayCellWidth;
        //alert(TimelineCalendar.calendarEvents[i].dayEnd+'???');

        //eventLength in days
        eventLength = Math.round(eventLength / (3600 * 24 * 1000));


        if (this.calendarEvents[i].type == 'hotel') {

            //console.log(TimelineCalendar.calendarEvents[i]);
            /** @var dt Date */

            var hotelDiv = this.generateHotelDiv(this.calendarEvents[i]);

            var renderedLength = 0;
            var endDraw = false;
            var firstTime = true;
            //alert('numRender:'+numRender+' renderedLength:'+renderedLength+' eventLength:'+eventLength);
            //continue;
            while (!endDraw) {
                var newEventElement = $(hotelDiv);
                var deltaLeft = newEventElement.data('delta-left');
                if (firstTime) {
                    var numRender = 7 - this.getDay(tmpDate) -1;
                    //console.log('day:'+TimelineCalendar.getDay(tmpDate));
                    //console.log(numRender);

                    var leftPos = (7 - numRender) * dayWidth - deltaLeft;
                    //console.log(leftPos);
                    firstTime = false;
                } else {
                    var numRender = 7;
                    var leftPos = -renderedLength * dayWidth - deltaLeft;
                }
                if(firstElem){
                    /*var pointDiv = this.generateStartPoint(this.calendarEvents[i]);
                    var pointDivElement = $(pointDiv);
                    pointDivElement.css('left', leftPos + '%');
                    weekObj.append(pointDivElement);*/
                    //newEventElement.addClass('startPoint');
                    firstElem = false;
                }
                newEventElement.css('left', leftPos + '%');
                weekObj.append(newEventElement);
                renderedLength = renderedLength + numRender;
                if (renderedLength >= eventLength) {
                    endDraw = true;
                }
                weekNum++;
                weekObj = this.jObj.find('#weekNum-' + weekNum);
            }
        } else if (this.calendarEvents[i].type == 'flight') {

            var flightDiv = this.generateFlightDiv(this.calendarEvents[i]);
            var renderedLength = 0;
            var endDraw = false;
            var firstTime = true;
            //continue;
            if(!flightDiv){
                continue;
            }
            while (!endDraw) {
                var newEventElement = $(flightDiv);
                var deltaLeft = newEventElement.data('delta-left');
                if (firstTime) {
                    var numRender = 7 - this.getDay(tmpDate);
                    //console.log('day:'+TimelineCalendar.getDay(tmpDate));
                    //console.log(numRender);
                    var leftPos = (7 - numRender) * dayWidth + deltaLeft;
                    //console.log(leftPos);
                    firstTime = false;
                } else {
                    var numRender = 7;
                    var leftPos = -renderedLength * dayWidth + deltaLeft;
                }
                if(firstElem){
                    /*var pointDiv = this.generateStartPoint(this.calendarEvents[i]);
                    var pointDivElement = $(pointDiv);
                    pointDivElement.css('left', leftPos + '%');
                    weekObj.append(pointDivElement);*/
                    //newEventElement.addClass('startPoint');
                    firstElem = false;
                }
                newEventElement.css('left', leftPos + '%');

                //console.log(newEventElement);
                weekObj.append(newEventElement);
                renderedLength = renderedLength + numRender;
                if (renderedLength >= eventLength) {
                    endDraw = true;
                }
                weekNum++;
                weekObj = this.jObj.find('#weekNum-' + weekNum);
            }
        }
        lastId = i;
    }
    weekNum--;
    weekObj = this.jObj.find('#weekNum-' + weekNum);

    newEventElement.addClass('endPoint');
        /*var pointDiv = this.generateEndPoint(this.calendarEvents[lastId]);
        var pointDivElement = $(pointDiv);
        //pointDivElement.css('left', leftPos + '%');
        weekObj.append(pointDivElement);*/


}

VoyangaCalendarTimeline.prepareEvents = function () {
    console.log(this.calendarEvents);
    var self = this;
    $.each(this.calendarEvents, function (ind, el) {
        el.dayStart = Date.fromIso(el.dayStart);
        el.dayEnd = Date.fromIso(el.dayEnd);
        if(!self.minDate){
            self.minDate = el.dayStart;
        }else if(self.minDate > el.dayStart){
            self.minDate = el.dayStart;
        }
        if(!self.maxDate){
            self.maxDate = el.dayEnd;
        }else if(self.maxDate < el.dayEnd){
            self.maxDate = el.dayEnd;
        }
        if(el.type == 'flight'){
            var dt = el.dayStart;
            var dateLabel = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
            el.startInfo = {point: true,city:true,count: 1,position:0,dateLabel: dateLabel};
            var dt = el.dayEnd;
            var dateLabel = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
            el.endInfo = {point: true,city:true,count: 1,position:0,dateLabel: dateLabel};
            el.sortInd = ind;
        }else{
            el.startInfo = {count: 1,position:0};
            el.endInfo = {count: 1,position:0};
        }
    });
}

VoyangaCalendarTimeline.init = function () {
    VoyangaCalendarTimeline.minDate = false;
    VoyangaCalendarTimeline.maxDate = false;
    this.prepareEvents();
    this.slider.jObj = this.jObj;
    if(typeof this.jObj == 'string'){
        this.jObj = $(this.jObj);
    }
    this.calendarEvents.sort(this.eventsCompareFunction);

    //console.log(TimelineCalendar.calendarEvents);
    //return true;
    this.generateGrid();
    //return true;
    this.generateEvents();
    this.slider.init();
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
