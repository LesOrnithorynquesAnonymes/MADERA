/// <reference path="../../lib/jQuery.d.ts" />
/// <reference path="../../lib/three.d.ts" />
/// <reference path="../core/utils.ts" />
/// <reference path="wall.ts" />
/// <reference path="corner.ts" />
/// <reference path="room.ts" />
/// <reference path="half_edge.ts" />
var BP3D;
(function (BP3D) {
    var Model;
    (function (Model) {
        /** */
        var defaultFloorPlanTolerance = 10.0;
        /**
         * A Floorplan represents a number of Walls, Corners and Rooms.
         */
        var Floorplan = /** @class */ (function () {
            /** Constructs a floorplan. */
            function Floorplan() {
                /** */
                this.walls = [];
                /** */
                this.corners = [];
                /** */
                this.rooms = [];
                /** */
                this.new_wall_callbacks = $.Callbacks();
                /** */
                this.new_corner_callbacks = $.Callbacks();
                /** */
                this.redraw_callbacks = $.Callbacks();
                /** */
                this.updated_rooms = $.Callbacks();
                /** */
                this.roomLoadedCallbacks = $.Callbacks();
                /**
                * Floor textures are owned by the floorplan, because room objects are
                * destroyed and created each time we change the floorplan.
                * floorTextures is a map of room UUIDs (string) to a object with
                * url and scale attributes.
                */
                this.floorTextures = {};
            }
            // hack
            Floorplan.prototype.wallEdges = function () {
                var edges = [];
                this.walls.forEach(function (wall) {
                    if (wall.frontEdge) {
                        edges.push(wall.frontEdge);
                    }
                    if (wall.backEdge) {
                        edges.push(wall.backEdge);
                    }
                });
                return edges;
            };
            // hack
            Floorplan.prototype.wallEdgePlanes = function () {
                var planes = [];
                this.walls.forEach(function (wall) {
                    if (wall.frontEdge) {
                        planes.push(wall.frontEdge.plane);
                    }
                    if (wall.backEdge) {
                        planes.push(wall.backEdge.plane);
                    }
                });
                return planes;
            };
            Floorplan.prototype.floorPlanes = function () {
                return BP3D.Core.Utils.map(this.rooms, function (room) {
                    return room.floorPlane;
                });
            };
            Floorplan.prototype.fireOnNewWall = function (callback) {
                this.new_wall_callbacks.add(callback);
            };
            Floorplan.prototype.fireOnNewCorner = function (callback) {
                this.new_corner_callbacks.add(callback);
            };
            Floorplan.prototype.fireOnRedraw = function (callback) {
                this.redraw_callbacks.add(callback);
            };
            Floorplan.prototype.fireOnUpdatedRooms = function (callback) {
                this.updated_rooms.add(callback);
            };
            /**
             * Creates a new wall.
             * @param start The start corner.
             * @param end he end corner.
             * @returns The new wall.
             */
            Floorplan.prototype.newWall = function (start, end) {
                var wall = new Model.Wall(start, end);
                this.walls.push(wall);
                var scope = this;
                wall.fireOnDelete(function () {
                    scope.removeWall(wall);
                });
                this.new_wall_callbacks.fire(wall);
                this.update();
                return wall;
            };
            /** Removes a wall.
             * @param wall The wall to be removed.
             */
            Floorplan.prototype.removeWall = function (wall) {
                BP3D.Core.Utils.removeValue(this.walls, wall);
                this.update();
            };
            /**
             * Creates a new corner.
             * @param x The x coordinate.
             * @param y The y coordinate.
             * @param id An optional id. If unspecified, the id will be created internally.
             * @returns The new corner.
             */
            Floorplan.prototype.newCorner = function (x, y, id) {
                var _this = this;
                var corner = new Model.Corner(this, x, y, id);
                this.corners.push(corner);
                corner.fireOnDelete(function () {
                    _this.removeCorner;
                });
                this.new_corner_callbacks.fire(corner);
                return corner;
            };
            /** Removes a corner.
             * @param corner The corner to be removed.
             */
            Floorplan.prototype.removeCorner = function (corner) {
                BP3D.Core.Utils.removeValue(this.corners, corner);
            };
            /** Gets the walls. */
            Floorplan.prototype.getWalls = function () {
                return this.walls;
            };
            /** Gets the corners. */
            Floorplan.prototype.getCorners = function () {
                return this.corners;
            };
            /** Gets the rooms. */
            Floorplan.prototype.getRooms = function () {
                return this.rooms;
            };
            Floorplan.prototype.overlappedCorner = function (x, y, tolerance) {
                tolerance = tolerance || defaultFloorPlanTolerance;
                for (var i = 0; i < this.corners.length; i++) {
                    if (this.corners[i].distanceFrom(x, y) < tolerance) {
                        return this.corners[i];
                    }
                }
                return null;
            };
            Floorplan.prototype.overlappedWall = function (x, y, tolerance) {
                tolerance = tolerance || defaultFloorPlanTolerance;
                for (var i = 0; i < this.walls.length; i++) {
                    if (this.walls[i].distanceFrom(x, y) < tolerance) {
                        return this.walls[i];
                    }
                }
                return null;
            };
            // import and export -- cleanup
            Floorplan.prototype.saveFloorplan = function () {
                var floorplan = {
                    corners: {},
                    walls: [],
                    wallTextures: [],
                    floorTextures: {},
                    newFloorTextures: {}
                };
                this.corners.forEach(function (corner) {
                    floorplan.corners[corner.id] = {
                        'x': corner.x,
                        'y': corner.y
                    };
                });
                this.walls.forEach(function (wall) {
                    floorplan.walls.push({
                        'corner1': wall.getStart().id,
                        'corner2': wall.getEnd().id,
                        'frontTexture': wall.frontTexture,
                        'backTexture': wall.backTexture
                    });
                });
                floorplan.newFloorTextures = this.floorTextures;
                return floorplan;
            };
            Floorplan.prototype.loadFloorplan = function (floorplan) {
                this.reset();
                var corners = {};
                if (floorplan == null || !('corners' in floorplan) || !('walls' in floorplan)) {
                    return;
                }
                for (var id in floorplan.corners) {
                    var corner = floorplan.corners[id];
                    corners[id] = this.newCorner(corner.x, corner.y, id);
                }
                var scope = this;
                floorplan.walls.forEach(function (wall) {
                    var newWall = scope.newWall(corners[wall.corner1], corners[wall.corner2]);
                    if (wall.frontTexture) {
                        newWall.frontTexture = wall.frontTexture;
                    }
                    if (wall.backTexture) {
                        newWall.backTexture = wall.backTexture;
                    }
                });
                if ('newFloorTextures' in floorplan) {
                    this.floorTextures = floorplan.newFloorTextures;
                }
                this.update();
                this.roomLoadedCallbacks.fire();
            };
            Floorplan.prototype.getFloorTexture = function (uuid) {
                if (uuid in this.floorTextures) {
                    return this.floorTextures[uuid];
                }
                else {
                    return null;
                }
            };
            Floorplan.prototype.setFloorTexture = function (uuid, url, scale) {
                this.floorTextures[uuid] = {
                    url: url,
                    scale: scale
                };
            };
            /** clear out obsolete floor textures */
            Floorplan.prototype.updateFloorTextures = function () {
                var uuids = BP3D.Core.Utils.map(this.rooms, function (room) {
                    return room.getUuid();
                });
                for (var uuid in this.floorTextures) {
                    if (!BP3D.Core.Utils.hasValue(uuids, uuid)) {
                        delete this.floorTextures[uuid];
                    }
                }
            };
            /** */
            Floorplan.prototype.reset = function () {
                var tmpCorners = this.corners.slice(0);
                var tmpWalls = this.walls.slice(0);
                tmpCorners.forEach(function (corner) {
                    corner.remove();
                });
                tmpWalls.forEach(function (wall) {
                    wall.remove();
                });
                this.corners = [];
                this.walls = [];
            };
            /**
             * Update rooms
             */
            Floorplan.prototype.update = function () {
                this.walls.forEach(function (wall) {
                    wall.resetFrontBack();
                });
                var roomCorners = this.findRooms(this.corners);
                this.rooms = [];
                var scope = this;
                roomCorners.forEach(function (corners) {
                    scope.rooms.push(new Model.Room(scope, corners));
                });
                this.assignOrphanEdges();
                this.updateFloorTextures();
                this.updated_rooms.fire();
            };
            /**
             * Returns the center of the floorplan in the y plane
             */
            Floorplan.prototype.getCenter = function () {
                return this.getDimensions(true);
            };
            Floorplan.prototype.getSize = function () {
                return this.getDimensions(false);
            };
            Floorplan.prototype.getDimensions = function (center) {
                center = center || false; // otherwise, get size
                var xMin = Infinity;
                var xMax = -Infinity;
                var zMin = Infinity;
                var zMax = -Infinity;
                this.corners.forEach(function (corner) {
                    if (corner.x < xMin)
                        xMin = corner.x;
                    if (corner.x > xMax)
                        xMax = corner.x;
                    if (corner.y < zMin)
                        zMin = corner.y;
                    if (corner.y > zMax)
                        zMax = corner.y;
                });
                var ret;
                if (xMin == Infinity || xMax == -Infinity || zMin == Infinity || zMax == -Infinity) {
                    ret = new THREE.Vector3();
                }
                else {
                    if (center) {
                        // center
                        ret = new THREE.Vector3((xMin + xMax) * 0.5, 0, (zMin + zMax) * 0.5);
                    }
                    else {
                        // size
                        ret = new THREE.Vector3((xMax - xMin), 0, (zMax - zMin));
                    }
                }
                return ret;
            };
            Floorplan.prototype.assignOrphanEdges = function () {
                // kinda hacky
                // find orphaned wall segments (i.e. not part of rooms) and
                // give them edges
                var orphanWalls = [];
                this.walls.forEach(function (wall) {
                    if (!wall.backEdge && !wall.frontEdge) {
                        wall.orphan = true;
                        var back = new Model.HalfEdge(null, wall, false);
                        back.generatePlane();
                        var front = new Model.HalfEdge(null, wall, true);
                        front.generatePlane();
                        orphanWalls.push(wall);
                    }
                });
            };
            /*
             * Find the "rooms" in our planar straight-line graph.
             * Rooms are set of the smallest (by area) possible cycles in this graph.
             * @param corners The corners of the floorplan.
             * @returns The rooms, each room as an array of corners.
             */
            Floorplan.prototype.findRooms = function (corners) {
                function _calculateTheta(previousCorner, currentCorner, nextCorner) {
                    var theta = BP3D.Core.Utils.angle2pi(previousCorner.x - currentCorner.x, previousCorner.y - currentCorner.y, nextCorner.x - currentCorner.x, nextCorner.y - currentCorner.y);
                    return theta;
                }
                function _removeDuplicateRooms(roomArray) {
                    var results = [];
                    var lookup = {};
                    var hashFunc = function (corner) {
                        return corner.id;
                    };
                    var sep = '-';
                    for (var i = 0; i < roomArray.length; i++) {
                        // rooms are cycles, shift it around to check uniqueness
                        var add = true;
                        var room = roomArray[i];
                        for (var j = 0; j < room.length; j++) {
                            var roomShift = BP3D.Core.Utils.cycle(room, j);
                            var str = BP3D.Core.Utils.map(roomShift, hashFunc).join(sep);
                            if (lookup.hasOwnProperty(str)) {
                                add = false;
                            }
                        }
                        if (add) {
                            results.push(roomArray[i]);
                            lookup[str] = true;
                        }
                    }
                    return results;
                }
                function _findTightestCycle(firstCorner, secondCorner) {
                    var stack = [];
                    var next = {
                        corner: secondCorner,
                        previousCorners: [firstCorner]
                    };
                    var visited = {};
                    visited[firstCorner.id] = true;
                    while (next) {
                        // update previous corners, current corner, and visited corners
                        var currentCorner = next.corner;
                        visited[currentCorner.id] = true;
                        // did we make it back to the startCorner?
                        if (next.corner === firstCorner && currentCorner !== secondCorner) {
                            return next.previousCorners;
                        }
                        var addToStack = [];
                        var adjacentCorners = next.corner.adjacentCorners();
                        for (var i = 0; i < adjacentCorners.length; i++) {
                            var nextCorner = adjacentCorners[i];
                            // is this where we came from?
                            // give an exception if its the first corner and we aren't at the second corner
                            if (nextCorner.id in visited &&
                                !(nextCorner === firstCorner && currentCorner !== secondCorner)) {
                                continue;
                            }
                            // nope, throw it on the queue  
                            addToStack.push(nextCorner);
                        }
                        var previousCorners = next.previousCorners.slice(0);
                        previousCorners.push(currentCorner);
                        if (addToStack.length > 1) {
                            // visit the ones with smallest theta first
                            var previousCorner = next.previousCorners[next.previousCorners.length - 1];
                            addToStack.sort(function (a, b) {
                                return (_calculateTheta(previousCorner, currentCorner, b) -
                                    _calculateTheta(previousCorner, currentCorner, a));
                            });
                        }
                        if (addToStack.length > 0) {
                            // add to the stack
                            addToStack.forEach(function (corner) {
                                stack.push({
                                    corner: corner,
                                    previousCorners: previousCorners
                                });
                            });
                        }
                        // pop off the next one
                        next = stack.pop();
                    }
                    return [];
                }
                // find tightest loops, for each corner, for each adjacent
                // TODO: optimize this, only check corners with > 2 adjacents, or isolated cycles
                var loops = [];
                corners.forEach(function (firstCorner) {
                    firstCorner.adjacentCorners().forEach(function (secondCorner) {
                        loops.push(_findTightestCycle(firstCorner, secondCorner));
                    });
                });
                // remove duplicates
                var uniqueLoops = _removeDuplicateRooms(loops);
                //remove CW loops
                var uniqueCCWLoops = BP3D.Core.Utils.removeIf(uniqueLoops, BP3D.Core.Utils.isClockwise);
                return uniqueCCWLoops;
            };
            return Floorplan;
        }());
        Model.Floorplan = Floorplan;
    })(Model = BP3D.Model || (BP3D.Model = {}));
})(BP3D || (BP3D = {}));
//# sourceMappingURL=floorplan.js.map