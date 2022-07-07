import { defineStore } from "pinia";
import io from 'socket.io-client';
import { checkDataFormat, getRequest } from '@/services/ajax.js';
import { stt } from '@/services/common.js';
import { watch, toRef } from 'vue';

export const useMpdStatusStore = defineStore( 'MpdStatusStore', {
    state: () => {
        var trackUpdateStoreValues;
        var socket;
        const coverPlaceHolder = "data:image/jpg;base64, /9j/4AAQSkZJRgABAQEASABIAAD/4QedaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pgo8eDp4bXBtZXRhIHhtbG5zOng9J2Fkb2JlOm5zOm1ldGEvJz4KPHJkZjpSREYgeG1sbnM6cmRmPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjJz4KCiA8cmRmOkRlc2NyaXB0aW9uIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOmZvcm1hdD5pbWFnZS9qcGVnPC9kYzpmb3JtYXQ+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+eC1kZWZhdWx0PC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiB4bWxuczp4bXA9J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8nPgogIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTctMTAtMTJUMTY6MTg6MzctMDQ6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgPHhtcDpNb2RpZnlEYXRlPjIwMTctMTAtMTJUMjA6MTg6MzdaPC94bXA6TW9kaWZ5RGF0ZT4KICA8eG1wOkNyZWF0ZURhdGU+MjAxNy0xMC0xMlQxNjoxODozNy0wNDowMDwveG1wOkNyZWF0ZURhdGU+CiAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBJbGx1c3RyYXRvciBDQyAyMDE3IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlvbiB4bWxuczp4bXBNTT0naHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyc+CiAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpkNTFiZGQ4MC02ODE2LTU2NDctOTE3OS05ZGZmMzAzNTQwNzY8L3htcE1NOkluc3RhbmNlSUQ+CiAgPHhtcE1NOkRvY3VtZW50SUQgcmRmOnJlc291cmNlPSd4bXAuZGlkOmQ1MWJkZDgwLTY4MTYtNTY0Ny05MTc5LTlkZmYzMDM1NDA3NicgLz4KICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnV1aWQ6NUQyMDg5MjQ5M0JGREIxMTkxNEE4NTkwRDMxNTA4Qzg8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICA8eG1wTU06UmVuZGl0aW9uQ2xhc3M+cHJvb2Y6cGRmPC94bXBNTTpSZW5kaXRpb25DbGFzcz4KICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0nUmVzb3VyY2UnCiAgIHhtbG5zOnN0UmVmPSdodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjJz4KICAgPHN0UmVmOmluc3RhbmNlSUQ+dXVpZDo5OWE5M2U4ZS0xZWQ5LTRmNjktYmU2MC0wNzViMWM0NWEzNzY8L3N0UmVmOmluc3RhbmNlSUQ+CiAgIDxzdFJlZjpkb2N1bWVudElEPnhtcC5kaWQ6ZGUyZDYyM2YtZjIxMS1lNDQ3LWI0ODUtZTllZmRhNjFhMTFiPC9zdFJlZjpkb2N1bWVudElEPgogICA8c3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPnV1aWQ6NUQyMDg5MjQ5M0JGREIxMTkxNEE4NTkwRDMxNTA4Qzg8L3N0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD4KICAgPHN0UmVmOnJlbmRpdGlvbkNsYXNzPnByb29mOnBkZjwvc3RSZWY6cmVuZGl0aW9uQ2xhc3M+CiAgPC94bXBNTTpEZXJpdmVkRnJvbT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24geG1sbnM6aWxsdXN0cmF0b3I9J2h0dHA6Ly9ucy5hZG9iZS5jb20vaWxsdXN0cmF0b3IvMS4wLyc+CiAgPGlsbHVzdHJhdG9yOlN0YXJ0dXBQcm9maWxlPlByaW50PC9pbGx1c3RyYXRvcjpTdGFydHVwUHJvZmlsZT4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24geG1sbnM6cGRmPSdodHRwOi8vbnMuYWRvYmUuY29tL3BkZi8xLjMvJz4KICA8cGRmOlByb2R1Y2VyPkFkb2JlIFBERiBsaWJyYXJ5IDE1LjAwPC9wZGY6UHJvZHVjZXI+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9J3InPz4K/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8IAEQgALAAsAwERAAIRAQMRAf/EABgAAQEAAwAAAAAAAAAAAAAAAAUEAwYH/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAB7rc4A2iLD6HTpmdRVChNFJJW/wCaaRVMmEnt3jFLsJshqAmTtHPYGgdgth5Od3571LUwGQ03UMT/xAAdEAACAwEAAwEAAAAAAAAAAAAAAgEDBBESISIT/9oACAEBAAEFAuyNJY0wPp8SzaPs9tYPaPaXNDDZ4YbF7sng9gzksTYTI+di3PMD9gdpHsP2k00+JbDQXSWNwe0jrFn3F/y9NcXzZhp5prjyj4P/xAAUEQEAAAAAAAAAAAAAAAAAAABQ/9oACAEDAQE/ARP/xAAUEQEAAAAAAAAAAAAAAAAAAABQ/9oACAECAQE/ARP/xAAfEAACAQQDAQEAAAAAAAAAAAAAATECEBEhEiBRMnH/2gAIAQEABj8CJtp9tolkrr4SfV4tJlVHpvTvowxofI1Tx/B0yYR//8QAIBAAAgIBBAMBAAAAAAAAAAAAAAERIUExUWFxEIGRwf/aAAgBAQABPyF9PY58yfqehrTAx7VuyzfnOcp5BzSOBH6JHnkJBSJKoMnQP6J7okW/qNpPQll8IRoYXcQ9zQGgqXAn814EtRQLLYmO1TpPIspwsIeaxuwq8oLL1KMB/9oADAMBAAIAAwAAABBteORz06HxfnNg1ZRCP//EABoRAAIDAQEAAAAAAAAAAAAAAAARARAgMDH/2gAIAQMBAT8QtjHlC2hYfCSBV4f/xAAZEQADAQEBAAAAAAAAAAAAAAAAAREQICH/2gAIAQIBAT8Q2CRMhMpRdUvEF2vRuCbFn//EACIQAQACAQMFAAMAAAAAAAAAAAEAESExUWFBcZHB0YGhsf/aAAgBAQABPxA6oh5eoTo4OCEKwOuUaJ3hj47wi/bK7zNXMwsWom+fJHVPspj7D45v7LC2zcYOfaFes83HLcuxHxPCtEu/ZEdPxfqE2FOQltLHfIgLYflNEtd5UBB3j4DjsDTH2p4af3CA+5VX9iznkJZduIStBrMEP1REXNIdUX515CnviOTkbp83LDDo9gjR0nV1Z//Z";
        var mobile = '';
        var defaultView = 'tileview';
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            mobile = 'mobile';
            defaultView = 'listview';
        }
        
        return {
            trackUpdateStoreValues,
            socket,
            isMobile: mobile,
            mpdstatus:
                {
                    repeat:false,
                    random:false,
                    single:false,
                    consume:false,
                    playlist:0,
                    playlistlength:0,
                    mixrampdb:0,
                    state:"stop",
                    song:0,
                    songid:0,
                    time:0,
                    elapsed:0,
                    bitrate:0,
                    duration:0,
                    audio:"",
                    nextsong:0,
                    nextsongid:0,
                    audioSampleRate:0,
                    audioSampleDepth:0,
                    audioChannels:""
                    
                },
            currentsong:
                {
                    file:"",
                    path:"",
                    cover:coverPlaceHolder,
                    lastModified:"",
                    artist:"",
                    title:"",
                    album:"",
                    track:"",
                    genre:"",
                    date:"",
                    albumArtist:"",
                    time:0,
                    pos:0,
                    id:0
                    
                },
            currentdata:
                {
                    lineOne: "",
                    lineTwo: "",
                    elapsedFormatted: "0:00",
                    durationFormatted: "0:00",
                    infoView: defaultView,
                    search: ""
                },
            lsinfo:
                {
                    path: "",
                    value: ""
                },
            defaultStates:
                {
                    cover: coverPlaceHolder
                },
            libraryCrumbs: 
                [
                    {
                    label: "Home",
                    path: ""
                    }
                ],
            currentPlaylist:
                [
                
                ],
            
        }
    },
    
    actions: {
        test() {
            console.log('it works!');
        },
        updateMpdStatus(newData) {
            if (checkDataFormat(newData)) {
                newData = JSON.parse(newData);
                if (newData.state !== undefined) {
                    console.log('updating status');
                    if (newData.playlist !== undefined && (newData.playlist != this.mpdstatus.playlist || this.currentPlaylist.length != newData.playlistlength)) {
                        console.log('updating current play queue');
                        console.log(this.currentPlaylist);
                        console.log(this.currentPlaylist.length);
                        console.log(newData.playlistlength);
                        this.getMpdPlaylist();
                        //getRequest('/api/playlistinfo', false, false, function (nd, post, url, headers) {this.updateMpdPlaylist(nd, post, url, headers);}.bind(this));
                    }
                    this.mpdstatus = newData;
                    
                    if (newData.state == 'stop') {
                        this.updateMpdCurrent('{"song":{"file": ""}}');
                    }
                    
                    this.currentdata.elapsedFormatted = stt(this.mpdstatus.elapsed);
                    this.currentdata.durationFormatted = stt(this.mpdstatus.duration);
                } else {
                    console.log('error getting update');
                    console.log(newData);
                }
                
            } else {
                console.log('status data incomplete!');
                console.log(newData);
            }
        },
        updateMpdCurrent(newData) {
            console.log('updating track data!');
            //console.log(newData);
            if (checkDataFormat(newData)) {
                newData = JSON.parse(newData);
                newData = newData.song
                
                /*Perhaps this is a janky way of performing a foreach statement against a store/state*/
                var current = {};
                current = JSON.parse(JSON.stringify(this.currentsong));

                for (const [key, value] of Object.entries(current)) {
                    if (newData[key]) {
                        this['currentsong'][key] = newData[key];
                    } else if (key != "cover") {
                        this['currentsong'][key] = "";
                    }
                }
                
                if (newData['file'] != '') {
                    var temp = newData['file'].split('/');
                    temp.pop();
                    this['currentsong']['path'] = temp.join('/');
                    this.currentsong.cover='/mm/cover.php?dir='+this.currentsong.path+'&type=album';
                } else {
                    this.currentsong.cover=this.defaultStates.cover;
                }
                
                if (this.mpdstatus.state == 'stop') {
                    this.currentdata.lineOne = 'Player';
                    this.currentdata.lineTwo = 'Stopped';
                    this.currentsong.cover = this.defaultStates.cover
                    this.currentdata.elapsedFormatted = "0:00"
                    this.currentdata.durationFormatted = "0:00"
                } else {
                    if (this.currentsong.title != '') {
                        this.currentdata.lineOne = this.currentsong.title;
                    } else {
                        this.currentdata.lineOne = 'alt state';
                    }
                    if (this.currentsong.artist != '') {
                        this.currentdata.lineTwo = this.currentsong.artist;
                    } else {
                        this.currentdata.lineTwo = 'alt state';
                    }
                }
            } else {
                console.log('track data incomplete!');
                console.log(newData);
            }
            
        },
        updateStoreValues(count) {
            //console.log(count);
            ++count;
            if (count > 10) {
                count=0;
                this.socket.emit('status');
            }
            this.trackUpdateStoreValues = setTimeout(function(){this.updateStoreValues(count);}.bind(this),1000);
            if (this.mpdstatus.state) {
                if (this.mpdstatus.state == 'play' && this.mpdstatus.elapsed && this.mpdstatus.elapsed < this.mpdstatus.duration) {
                    ++this.mpdstatus.elapsed;
                    this.currentdata.elapsedFormatted = stt(this.mpdstatus.elapsed);
                } else {
                    //console.log('-');
                }
            } else {
                console.log(this.mpdstatus);
            }
            
        },
        updateMpdLibPath(data, url, post, headers, search) {
            console.log('updating lsinfo');
            post = JSON.parse(post);
            if (checkDataFormat(data)) {
                console.log(this.libraryCrumbs.length);
                if (post.path != "" && !search) {
                    var temp = post['path'].split('/');
                    this['libraryCrumbs'][this.libraryCrumbs.length]={"label": temp[temp.length-1],"path": post.path};
                } else if (!search) {
                    this['libraryCrumbs']=[{label: "Home",path: ""}];
                }
                if (!search) {
                    this.lsinfo.path = post.path;
                }
                if (search) {
                    var newValues = JSON.parse(data);
                    if (newValues.length > 40) {
                        newValues.splice(40);
                    }
                    this.lsinfo.values = newValues;
                } else {
                    this.lsinfo.values = JSON.parse(data);
                }
                for (var i = 0; this.lsinfo.values[i]; ++i) {
                    if (this.lsinfo.values[i].directory) {
                        var temp = this.lsinfo.values[i].directory.split('/');
                        this.lsinfo.values[i].label=temp[temp.length-1];
                        this.lsinfo.values[i].cover='/mm/cover.php?dir='+this.lsinfo.values[i].directory+'&type=album'
                    } else if (this.lsinfo.values[i].file) {
                        var temp = this.lsinfo.values[i].file.split('/');
                        var filename = temp.pop();
                        this.lsinfo.values[i].cover='/mm/cover.php?dir='+temp.join('/')+'&type=album';
                        if (!this.lsinfo.values[i].title) {
                            this.lsinfo.values[i].title=filename;
                        }
                    }
                } 
                //console.log(this.lsinfo.values.length);
            } else {
                console.log('lsinfo failed!');
            }
        },
        getMpdPlaylist(data, url, port, headers) {
            getRequest('/api/playlistinfo', false, false, function (nd, post, url, headers) {this.updateMpdPlaylist(nd, post, url, headers);}.bind(this));
        },
        updateMpdPlaylist(data, url, post, headers) {
            var temp = data.split("\n");
            var c = -1;
            //console.log(data);
            this['currentPlaylist']=[];
            for (var i = 0; temp[i]; ++i) {
                var keyVal = temp[i].split(': ');
                if (keyVal[0] && keyVal[0] == 'file') {
                    ++c;
                    this['currentPlaylist'][c] = {};
                    var getcover = keyVal[1].split('/');
                    var filename = getcover.pop();
                    this['currentPlaylist'][c]['cover']='/mm/cover.php?dir='+getcover.join('/')+'&type=album';
                }
                if (keyVal.length > 1) {
                    this['currentPlaylist'][c][keyVal[0]] = keyVal[1];
                }
            }
            //console.log(this.currentPlaylist);
        },
        onFooChanged() {
            console.log('foo changed');
        }
        
    },
    
    created() {
        console.log("hello");
        
    }
    
    
});



/*
export const useMpdStatusStore = defineStore( id: "MpdStatusStore", options: {
    state: () => {
        return {mpdstatus:{repeat:false,random:false,single:false,consume:false,playlist:3,playlistlength:11,mixrampdb:0,state:"play",song:0,songid:1,time:163,elapsed:49,bitrate:1153,duration:163.120,audio:"44100:16:2",nextsong:1,nextsongid:2,audioSampleRate:44100,audioSampleDepth:16,audioChannels:"Stereo"}}
    }
});
*/
