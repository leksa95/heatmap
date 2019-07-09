let Heatmap = function () {
    this.props = {
        classes: {
            point: 'point',
            pointInfo: 'pointInfo',
            added: 'added',
            filter: 'filter',
            filterItem: 'filterItem'
        },
        data: {
            sessionId: this.checkSession(),
            events: this.checkEvents()
        },
        filter: []
    }
};

Heatmap.prototype.checkSession = function () {
    if (sessionStorage.getItem('sessionId')) {
        return sessionStorage.getItem('sessionId');
    } else {
        sessionStorage.setItem('sessionId', Math.random().toString(36).substring(7));
        return sessionStorage.getItem('sessionId');
    }
};

Heatmap.prototype.checkEvents = function () {
    if (sessionStorage.getItem('sessionEvents')) {
        return JSON.parse(sessionStorage.getItem('sessionEvents'));
    } else {
        return [];
    }
};

Heatmap.prototype.createFilter = function (e) {
    let self = this,
        classes = self.props.classes;

    if (self.props.filter.length === 0) {
        self.props.filter.push(e.type);
        let filter = document.createElement('span');
        filter.classList.add(classes.filter);
        document.body.append(filter);

        let filterItemShowAll = document.createElement('span');
        filterItemShowAll.classList.add(classes.filterItem);
        filterItemShowAll.dataset.event = classes.point;
        filterItemShowAll.innerHTML = 'show all';
        filter.append(filterItemShowAll);

        filterItemShowAll.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        filterItemShowAll.addEventListener('mouseup', function (e) {
            e.stopPropagation();
        });
        filterItemShowAll.addEventListener('click', function (e) {
            e.stopPropagation();
            self.filter(e);
        });

        let filterItem = document.createElement('span');
        filterItem.classList.add(classes.filterItem);
        filterItem.dataset.event = e.type;
        filterItem.innerHTML = e.type;
        filter.append(filterItem);

        filterItem.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        filterItem.addEventListener('mouseup', function (e) {
            e.stopPropagation();
        });
        filterItem.addEventListener('click', function (e) {
            e.stopPropagation();
            self.filter(e);
        });

    } else {
        if (self.props.filter.indexOf(e.type) === -1) {
            self.props.filter.push(e.type);

            let filterItem = document.createElement('span');
            filterItem.classList.add(classes.filterItem);
            filterItem.dataset.event = e.type;
            filterItem.innerHTML = e.type;
            document.querySelector(`.${classes.filter}`).append(filterItem);

            filterItem.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });
            filterItem.addEventListener('mouseup', function (e) {
                e.stopPropagation();
            });
            filterItem.addEventListener('click', function (e) {
                e.stopPropagation();
                self.filter(e);
            });
        }
    }
};

Heatmap.prototype.filter = function (e) {
    let self = this,
        classes = self.props.classes;

    let currentItem = e.target;
    let filterItems = document.querySelectorAll(`.${classes.filterItem}`);
    filterItems.forEach(function (filterItem) {
        filterItem.classList.remove('active');
    });
    currentItem.classList.add('active');
    let allPoints = document.querySelectorAll(`.${classes.point}`);
    allPoints.forEach(function (point) {
        if (point.classList.contains(currentItem.dataset.event)) {
            point.classList.remove('hidden');
        } else {
            point.classList.add('hidden');
        }
    });
};

Heatmap.prototype.createPointAfterError = function () {
    let self = this,
        data = self.props.data;

    if (data.events.length > 0) {
        data.events.forEach(function (e) {
            self.createPoint(e, true)
        });
    }
};

Heatmap.prototype.pushData = function (e) {
    let self = this,
        data = self.props.data;

    if (e.type == 'touchstart' || e.type == 'touchend' || e.type == 'touchmove' || e.type == 'touchcancel') {
        data.events.push({
            timeStamp: e.timeStamp,
            type: e.type,
            coordinates: {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            },
            screen: e.changedTouches[0].target.tagName
        });
    } else {
        data.events.push({
            timeStamp: e.timeStamp,
            type: e.type,
            coordinates: {
                x: e.clientX,
                y: e.clientY,
            },
            screen: e.target.tagName
        });
    }

    sessionStorage.setItem('sessionEvents', JSON.stringify(data.events));
};

Heatmap.prototype.createPoint = function (e, bool) {
    let self = this,
        classes = self.props.classes;

    self.createFilter(e);

    if (bool) {
        let point = document.createElement('span');
        point.classList.add(classes.point);
        point.classList.add(e.type);
        point.classList.add(classes.added);
        point.style.left = e.coordinates.x + 'px';
        point.style.top = e.coordinates.y + 'px';
        document.body.append(point);

        let pointInfo = document.createElement('span');
        pointInfo.classList.add(classes.pointInfo);
        pointInfo.innerHTML =
            `<span class="sessionId"><strong>sessionId:</strong> ${self.props.data.sessionId}</span>
             <span class="timeStamp"><strong>timeStamp:</strong> ${e.timeStamp}</span>
             <span class="type"><strong>type:</strong> ${e.type}</span>
             <span class="coordinates"><strong>coordinates:</strong> <br/>x: ${e.coordinates.x} , y: ${e.coordinates.y}</span>
             <span class="screen"><strong>screen:</strong> ${e.screen}</span>`;
        point.append(pointInfo);

        setTimeout(function () {
            point.classList.remove(classes.added);
        });
    } else {
        self.pushData(e);
        let point = document.createElement('span');
        point.classList.add(classes.point);
        point.classList.add(e.type);
        point.classList.add(classes.added);
        if (e.type == 'touchstart' || e.type == 'touchend' || e.type == 'touchmove' || e.type == 'touchcancel') {
            point.style.left = e.changedTouches[0].clientX + 'px';
            point.style.top = e.changedTouches[0].clientY + 'px';
        } else {
            point.style.left = e.clientX + 'px';
            point.style.top = e.clientY + 'px';
        }
        document.body.append(point);

        let pointInfo = document.createElement('span');
        pointInfo.classList.add(classes.pointInfo);
        if (e.type == 'touchstart' || e.type == 'touchend' || e.type == 'touchmove' || e.type == 'touchcancel') {
            pointInfo.innerHTML =
                `<span class="sessionId"><strong>sessionId:</strong> ${self.props.data.sessionId}</span>
             <span class="timeStamp"><strong>timeStamp:</strong> ${e.timeStamp}</span>
             <span class="type"><strong>type:</strong> ${e.type}</span>
             <span class="coordinates"><strong>coordinates:</strong> <br/>x: ${e.changedTouches[0].clientX} , y: ${e.changedTouches[0].clientY}</span>
             <span class="screen"><strong>screen:</strong> ${e.changedTouches[0].target.tagName}</span>`;
        } else {
            pointInfo.innerHTML =
                `<span class="sessionId"><strong>sessionId:</strong> ${self.props.data.sessionId}</span>
             <span class="timeStamp"><strong>timeStamp:</strong> ${e.timeStamp}</span>
             <span class="type"><strong>type:</strong> ${e.type}</span>
             <span class="coordinates"><strong>coordinates:</strong> <br/>x: ${e.clientX} , y: ${e.clientY}</span>
             <span class="screen"><strong>screen:</strong> ${e.target.tagName}</span>`;
        }
        point.append(pointInfo);

        setTimeout(function () {
            point.classList.remove(classes.added);
        });
    }
};

Heatmap.prototype.events = function () {
    let self = this;

    document.body.addEventListener('click', function (e) {
        self.createPoint(e);
    });

    document.body.addEventListener('touchstart', function (e) {
        console.log(e);
        self.createPoint(e);
    });

    document.body.addEventListener('touchend', function (e) {
        console.log(e);
        self.createPoint(e);
    });

    document.body.addEventListener('touchmove', function (e) {
        console.log(e);
        self.createPoint(e);
    });

    document.body.addEventListener('touchcancel', function (e) {
        console.log(e);
        self.createPoint(e);
    });

    document.body.addEventListener('mousedown', function (e) {
        self.createPoint(e);
    });

    document.body.addEventListener('mouseup', function (e) {
        self.createPoint(e);
    });
};

Heatmap.prototype.init = function () {
    this.createPointAfterError();
    this.events();
};

let heatmap = new Heatmap();
heatmap.init();