const basicGridJS = {
    grid: null, //GridJS
    object: null, //$("#DIV_ID")
    loadingStatus: false, //로딩중인 상태표시
    superinit: function(gridObject,customConfig){
        // 객체생성 및 속성정의
        this.object = gridObject;
        $.extend(true,this.conf,customConfig);
    },

    setGridColumns: function(columns){
        // 컬럼 설정 
        this.conf.columns = columns
    },

    setGridData: function(data){
        // 정적 데이터
        this.conf.data = data
    },

    loading: function(){
        this.loadingStatus = false;
    },

    loaded: function(){
        this.loadingStatus = true;
    },

    makeSelection: function(data, keyID){
        modData = data;
        modData.forEach(obj => obj[keyID] = null);
        return modData;
    },

    setGridLoadData: function(){
        // Ajax 등 로딩이 필요한 데이터
        this.conf.data = () => {
            return new Promise(resolve => {
                this.loader(this).then(() => {
                    // 로더가 true일경우
                    resolve(this.data); //this.conf.data 는 data이다.
                })
            })
        }
    },

    loader: (target) => {
        return new Promise(resolve => {
            var interval = setInterval( //loadingStatus가 true일때까지 돌린다.
                () => {
                    if(target.loadingStatus){ //loadingStatus가 true이면
                        clearInterval(interval); //그만돌린다.
                        resolve(); // 끝낸다.
                    }
                }, 100
            );
        })
    },

    conf: {
        columns: [], //컬럼
        data: [], //데이터
        pagination: {
            limit: 30, //최대 보여주는 행
            resetPageOnUpdate: false 
        },
        search: true, //검색바
        autoWidth: true, //자동너비
        sort: true, //정렬옵션
        fixedHeader: true, //스크롤시 컬럼고정
        language: { // 한글화
            search: {
                placeholder: "🔍검색"
            },
            sort: {
                sortAsc: '오름차순 정렬',
                sortDesc: '내림차순 정렬',
            },
            pagination: {
                previous: '이전',
                next: '다음',
                navigate: (page, pages) => `${pages}페이지 중 ${page} 페이지`,
                page: (page) => `${page} 페이지`,
                showing: '현재',
                of: '개의 데이터 | 총',
                to: '에서',
                results: '개의 데이터',
            },
            loading: '잠시만 기다려 주세요...',
            noRecordsFound: '조회 결과가 없습니다.',
            error: '데이터 조회 중 문제가 발생하였습니다.'
        },
        style: {
            table: {
                'font-size': '0.8em'
            }
        }
    },

    draw: function(){
        // 최초로 그려진적이 없으면 render
        if(this.grid == null){
            this.grid = new gridjs.Grid(
                this.conf
            ).render(this.object)
        // 그려진적이 있으면 forceRender
        }else{
            // resetPageOnUpdate 이 False인 경우 
            // 페이지네이션을 유지시켜준다
            // GridJS가 resetPageOnUpdate 옵션인 경우 자동으로 유지시켜줘야하나 버그로 인해 수동으로 바꿔준다.
            if(this.conf.pagination.resetPageOnUpdate===false){
                var currentPage = Number($(this.object).find(".gridjs-currentPage").text()) - 1
                if(currentPage === '' || currentPage < 0){
                    currentPage = 0
                }
                this.grid.config.pagination.page = currentPage
            }
            this.grid.forceRender()
        }
    },
   
    checkHighlightRow: function(value, row){
        if(row){
            for(var[key,val] of Object.entries(this.highLightRowVal)){
                var isIN = false;
                for(var cell of row.cells){
                    if(cell.data === key){
                        isIN = true;
                        break;
                    }
                }
                if(isIN){
                    return{
                        'data-cell-content': value,
                        'style':  `background-color: ${val};`
                    }
                }
            }
        }
    }
}