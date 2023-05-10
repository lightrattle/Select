const templateElem = document.createElement("template");
templateElem.innerHTML = `
    <div id="root">
        <style>
        /* 显示选择结果的框*/
            .cs-select{
                border: 0px;
                width: 100%;
                height: 100%;
                position: relative;
                display:flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                vertical-align: middle;
                overflow: hidden;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            //为cs-select中的id=input设置样式
            .cs-select #input:empty{
                width: 2px;
            }
            .cs-select #input:not(:empty){
                width: unset !important;
            }
            .cs-select::-webkit-scrollbar {
                width: 0;
                display: none !important;
            }            
            
            // /* 右侧三角形↓↓↓↓↓↓↓*/
            // .cs-select:after {
            //     color: #000;
            //     font-weight: bold;
            //     content: "∨";
            //     position: absolute;
            //     right: 4px;
            //     display:flex;
            //     flex-direction:row;
            //     align-items: center;
            //     justify-content: center;
            // }
            // .cs-select[show-select="false"]:after {
            //     color: #000;
            //     font-weight: bold;
            //     content: "∨";
            //     position: absolute;
            //     right: 4px;
            //     display:flex;
            //     flex-direction:row;
            //     align-items: center;
            //     justify-content: center;
            // }
            // .cs-select[show-select="true"]:after {
            //     color: #000;
            //     font-weight: bold;
            //     content: "∧";
            //     position: absolute;
            //     right: 4px;
            //     display:flex;
            //     flex-direction:row;
            //     align-items: center;
            //     justify-content: center;
            // }
            // .cs-select:not(:empty)::after {
            //     display: none;
            // }
            // //上面是加符号，下面是加图片(两种方式)
            // .cs-select:after{
            //     content:'';
            //     display: flex;
            //     align-items: right;
            //     justify-content: center;
            //     text-align: right;
            //     vertical-align: middle;
            //     width: 10px;
            //     height: 10px;
            //     background-image: url('../../../../common/components/jianjiaoxia.png');
            //     background-size: 100% 100%;
            //     margin-top:1px;
            //     float: right;
            // }
            // .cs-select[show-select="false"]:after {
            //     content:'';
            //     display: block;
            //     width: 10px;
            //     height: 10px;
            //     background-image: url('../../../../common/components/jianjiaoxia.png');
            //     background-size: 100% 100%;
            //     margin-top:1px;
            //     float: right;
            // }
            // .cs-select[show-select="true"]:after{
            //     content:'';
            //     display: block;
            //     width: 10px;
            //     height: 10px;
            //     background-image: url('../../../../common/components/jianjiaoshang.png');
            //     background-size: 100% 100%;
            //     margin-top:1px;
            //     float: right;
            // }
            // .cs-select:not(:empty)::after {
            //     display: none;
            // }
            // /* 右侧三角形↑↑↑↑↑↑↑*/

            .cs-select input{
                outline: none;
            }
            
            /* 如果显示结果的框中无数据，则可以显示预置文本*/
            .cs-select:empty::before {
                content: attr(placeholder);
                color: #ccc;
            }
            /* 下方下拉框*/
            .cs-select-box{
                line-height:180%;
                padding: 2px 2px 2px 2px;
                border: 1px solid #000;
                background: #fff; 
                overflow-y: scroll !important; 
                position: absolute;
                z-index: 9999 !important;
                display: none;
                max-width: 140px !important;
                height: 180px !important;
            }
            /* 联想输入的列表框*/
            .cs-select-box ul {
                overflow-x: hidden;
            }
            /* 联想输入的列表框中单行li*/
            .cs-select-box ul li{
                overflow-x: hidden;
                padding-right: 20px;
            }                
            /* 鼠标悬浮的样式设置*/
            .cs-select-box li:hover {
                background-color: #e0e0e0;
            }
            /* 这个及下面两个是右侧滚动条的样式设计*/
            .cs-select-box::-webkit-scrollbar{
                height: 8px;
                width: 8px;
            }
            .cs-select-box::-webkit-scrollbar-thumb {
                border-radius: 10px;
                border-style: dashed;
                border-color: transparent;
                border-width: 3px;
                background-color: rgba(157, 165, 183, 0.4);
                background-clip: padding-box;
            }
            .cs-select-box::-webkit-scrollbar-thumb:hover {
                background: rgba(157, 165, 183, 0.7);
            }
            /*隐藏单选的圆圈*/
            .cs-select-box input[type="radio"]{
                display: none
            }
            /*给下拉框中的每个选项加一个横线*/
            .cs-select-box div{
                border:0 0 1px 0 solid #ccc;
            }
            /* 鼠标悬浮在下拉框中的某个选项时的效果*/
            .cs-select-box div:hover{
                background-color: #e0e0e0;
            }         
            input{
                overflow: hidden; /* 隐藏超出长度文字 */
                white-space: nowrap; /* 禁止文字换行 */
                text-overflow: ellipsis; /* 溢出用省略号表示 */
            }
        </style>
        <div class="cs-select"></div>
        <div class="cs-select-box">
        </div>
    </div>
`
class Select extends HTMLElement {
    constructor() {
        super();
        this.oldOptions = [];//初始化用于下拉框填入数据的数组变量
        const shadow = this.attachShadow({ mode: 'open' });//设置shadow为开放（即可见），主要是为了有时候要通过shadowRoot获取内部元素
        const content = templateElem.content.cloneNode(true);//复制模板html

        //下面这里是使得下拉组件的背景色、下拉显示框的背景色、字号大小可以在组件引用处的style修改
        let style = document.createElement('style');
        this.cs_select_inputbackground = this.getAttribute("csSelectInputBackground");
        if(this.cs_select_inputbackground){
            style.textContent = '.cs-select input{background:' + this.cs_select_inputbackground +'}';
            shadow.appendChild(style);
        }
        this.cs_select_rootheight = this.getAttribute("csSelectRootHeight");
        if(this.cs_select_rootheight){
            style.textContent += '#root{background:' + this.cs_select_rootheight +'}';
            shadow.appendChild(style);
        }
        this.cs_select_inputfont_size = this.getAttribute("csSelectInputfontSize");
        if(this.cs_select_inputfont_size){
            style.textContent += '.cs-select input{font-size:' + this.cs_select_inputfont_size +'}';
            shadow.appendChild(style);
        }
        
        //下面是通过attr或者getAttribute获取的数据，除了指明的必填项，其他未可选参数
        this.name = this.getAttribute("name")!=null?this.getAttribute("name"):"";//获取组件的name属性
        this.cho = this.getAttribute("cho");//（必填项）此属性用于区分是单选还是多选，单选为radio，多选为checkbox
        this.isAsso = this.getAttribute("isAsso")!==null?this.getAttribute("isAsso"):"false";//此属性区分是否为联想输入，true代表是联想输入
        this.url = this.getAttribute("url")!==null?this.getAttribute("url"):"";//此属性用于走网络请求获取数据时，代表获取数据的接口
        this.mapping = JSON.parse(this.getAttribute("mapping")!==null?this.getAttribute("mapping"):"{}");//此属性代表从接口获取的数据与实际使用数据的映射关系
        this.getDataByLS = this.getAttribute("getDataByLS")!==null?this.getAttribute("getDataByLS"):"false";//此属性代表是否从sessionStorage获取数据（名字是LS，因为最初设计为localStorage）
        this.getDataBySQLlite = this.getAttribute("getDataBySQLlite")!==null?this.getAttribute("getDataBySQLlite"):"false";//此属性代表是否从SQLite获取数据（拼写有误）
        //下面这个属性是当网络请求接口返回的数据是【data：{extroFlour：{id: XXX, name：XXX}}，success：true】这种结构时获取额外层内部用的
        this.extroFlour = this.getAttribute("extroFlour")!==null?this.getAttribute("extroFlour"):null;

        // 此时是初始化，在此处获取窗口高度位置，随后在点击时修改下拉的定位
        //  获取窗口的总高度（通过top，获取程序总高和上方layout工具栏的高度相减）
        // const windowHeight = parent.document.documentElement.clientHeight;//用于后续去判断是否需要上移的变量，为项目的窗口高度
        // const layoutHeight = top.getWindow("layout_1").innerHeight + top.getWindow("layout_2").innerHeight;

        /** 下面是普通多选框的部分，当前层级的if和else if分别代表普通多选、普通单选、联想多选、联想单选 */
        if(this.cho === "checkbox" && this.isAsso === "false"){//为普通多选框
            shadow.appendChild(content);//组装下拉组件的
            
            // 这里是初始化组件时获取数据
            this.chooseGetMethod((obj)=>{     //这个chooseGetMethod方法是有回调的，它用于区分从哪种方式获取数据，并在回调时把数据放在oldOptions这个数组中
                //调用插入数据函数
                this.setBoxforCheckbox(shadow, obj.oldOptions);//此处将数据设置到下拉框里面去
            });

            this.$sele = shadow.querySelector(".cs-select");//获得显示框
            //为显示框添加cho属性
            this.$sele.setAttribute("cho", this.cho);
            this.$sele.setAttribute("name", this.name);
            this.$box = shadow.querySelector(".cs-select-box");//获得下拉菜单
            
            //加入事件监听
            this.$sele.addEventListener('click', (e)=>{//这个是显示框的点击事件，当点击时，显示/隐藏下拉菜单
                e.preventDefault();//取消默认事件
                /** 下面8行是用于判断下拉框是否需要显示在显示框上部的，以免点击的位置过低时看不见下拉框
                 *  注：这段代码在四个下拉的这个位置都有，在下面就不重复解释
                 */

                //设置this.$sele的高度，这样可以防撑开
                this.shadowRoot.querySelector(".cs-select")
                this.$sele.style.height = ''+this.$sele.offsetHeight + 'px';

                // var tdOffsetTop = $(this).parent()[0].offsetTop + layoutHeight;//这个变量获取的是组件的父节点td的top值
                // var scrollTop = parent.document.getElementById('iframeContrainer').scrollTop;// 此属性获取当前滚动的高度
                // tdOffsetTop -= scrollTop;//获得当前点击的组件位置在当前窗口的位置
                // // 判断是否在上半区域
                // if (tdOffsetTop  > (windowHeight/2 + 60)) {// 如果在下半部分，则需要移动
                //     // 将下拉菜单的top修改为：=原来值-下拉框高度 + 其父td的位置offsettop 
                //     $(this.$box)[0].style.top = $(this.$box)[0].offsetTop - 182 + $(this).parent()[0].offsetTop;                    
                // }

                let pthis = $(e.target);
                // 这里时点击显示框时获取数据
                this.oldOptions = [];//置空存放下拉数据的数组
                this.chooseGetMethod((obj)=>{
                    //调用插入数据函数
                    this.setBoxforCheckbox(shadow, obj.oldOptions);
                    //因为是异步的，所以在调试时发现下面的内容会被多次执行，而多次执行时pthis指向的内容不一致，故根据这个特点进行if判断
                    if(pthis.parent().find("cs-select").length < 1 && pthis.attr('show-select') == 'true'){
                        pthis.attr('show-select', 'false');
                        pthis.next().hide();// 下拉框已经显示，此时隐藏
                        return;
                    } else if(pthis.parent().find("cs-select").length < 1){
                        pthis.attr('show-select', 'false');
                        pthis.attr('show-select', 'true');
                        pthis.next().show();// 下拉框未显示，此时显示
                    }
                    //失焦逻辑
                    top.window.$(document).click(pthis,function(e){
                        //点击其他地方，不是下拉显示框和下拉框中的元素时隐藏当前下拉框（if中的判断依据是：若传入pthis不是cs-select的父元素（因为异步时pthis指向不一致）且（点击的地方不包含shadowRoot或点击的地方有shadowRoot但内部包含的cs-select不等于pthis的cs-select）
                        if((pthis.parent().find("cs-select").length == 0) && ((e.target.shadowRoot === null) || $(e.target.shadowRoot).children().find(".cs-select")[0] !== pthis[0])){
                            pthis[0].setAttribute('show-select', 'false');
                            pthis.next().hide();
                        }
                    });
                });
            });
        }
        else if(this.cho === "radio" && this.isAsso === "false"){//为普通单选框
            shadow.appendChild(content);//先加入内容元素到shadow

            this.chooseGetMethod((obj)=>{
                //调用插入数据函数
                this.setBoxforRadio(shadow, obj.oldOptions);
            });

            this.$sele = shadow.querySelector(".cs-select");//获得显示框
            //为显示框添加cho属性
            this.$sele.setAttribute("cho", this.cho);
            this.$sele.setAttribute("name", this.name);
            if(this.getAttribute("placeholder") !== null){
                this.$sele.setAttribute("placeholder", this.getAttribute("placeholder"));
            }
            this.$box = shadow.querySelector(".cs-select-box");//获得下拉菜单

            //加入事件监听
            this.$sele.addEventListener('click', (e)=>{
                e.preventDefault();
                //↓移动下拉框位置

                //设置this.$sele的高度，这样可以防撑开
                this.shadowRoot.querySelector(".cs-select")
                this.$sele.style.height = ''+this.$sele.offsetHeight + 'px';
            
                // var tdOffsetTop = $(this).parent()[0].offsetTop + layoutHeight;
                // var scrollTop = parent.document.getElementById('iframeContrainer').scrollTop;
                // tdOffsetTop -= scrollTop;
                // // 判断是否在上半区域
                // if (tdOffsetTop  > (windowHeight/2 + 60)) {// 如果需要移动
                //     // 将下拉菜单的top修改为：=原来值-下拉框高度 + 其父td的位置offsettop 
                //     $(this.$box)[0].style.top = $(this.$box)[0].offsetTop - 182 + $(this).parent()[0].offsetTop;                    
                // }

                let pthis = $(e.target);
                this.oldOptions = [];
                this.chooseGetMethod((obj)=>{
                    //调用插入数据函数
                    this.setBoxforRadio(shadow, obj.oldOptions);
                    if(pthis.parent().find("cs-select").length < 1 && pthis.attr('show-select') == 'true'){
                        pthis.attr('show-select', 'false');
                        pthis.next().hide();
                        return;
                    } else if(pthis.parent().find("cs-select").length < 1){
                        pthis.attr('show-select', 'false');
                        pthis.attr('show-select', 'true');
                        pthis.next().show();
                    }
                    //失焦逻辑
                    top.window.$(document).click(pthis,function(e){
                        if((pthis.parent().find("cs-select").length == 0) &&((e.target.shadowRoot === null) || $(e.target.shadowRoot).children().find(".cs-select")[0]  !== pthis[0])){
                            pthis[0].setAttribute('show-select', 'false');
                            pthis.next().hide();
                        }
                    });
                });
            });
        }
        else if(this.cho == "checkbox" && this.isAsso === "true"){//为联想多选框
            //由于后续会对下拉数据做处理，且不能删除原来的oldOptions列表，故维持一个新的数组用于联想的下拉
            //也就是说，初始将oldOptions的数据完整存放于newOptions，然后显示的是newOptions的内容，后续如果输入的文本，则对文本做执行搜索，将联想结果再次存放于newOptions
            this.newOptions = this.oldOptions;//这个数组最开始应该等于oldOptions

            this.$sele = content.querySelector(".cs-select");//获得显示框
            //调整显示框的样式
            $(this.$sele).css({
                'overflow': 'hidden',
                'flex-wrap': 'wrap',
                'overflow-y': 'scroll',
                'cursor':'text'
            });
            // this.$sele.setAttribute("style", "overflow: hidden");
            // this.$sele.setAttribute("style", "flex-wrap: wrap");
            // this.$sele.setAttribute("style", "overflow-y: scroll");
            this.$box = content.querySelector(".cs-select-box");//获得下拉菜单
            //调整下拉菜单的样式，包括背景色、滚动方式
            $(this.$box).css({
                'background-color': 'white',
                'overflow-y': 'scroll',
                'z-index': '91'
            });
            //为显示框添加cho属性（因为组件初始化后预置的属性值都在this即外部<cs-select>上，在组件内部调用就很麻烦，所以有些重要属性就再次复制到内部显示框来
            this.$sele.setAttribute("cho", this.cho);
            this.$sele.setAttribute("name", this.name);

            //为cs-select添加内部的文本框并设置样式（这个文本框是用来存放输入联想的待联想文本的，已经做了CSS就是当内容为空时宽2px，当内容不为空时宽度auto
            var input = $("<div tabindex='0' id='input' style='outline: none;;border: 0;text-align:left;vertical-align:middle;width:2px' contenteditable='true'></div>");
            $(this.$sele).append(input);

            shadow.appendChild(content);

            //输入文本时调用展示下拉菜单函数
            $(this.$sele).find("#input").on('input propertychange', ()=>{
                // 获取输入框的待联想文本
                // 根据待联想文本去调用设置下拉框的函数

                var pthis = $(this.$sele).find("#input");// 获取输入域元素
                var tagstr = pthis.html();// 获取输入域元素中的文本

                //下面这里是开始执行联想判断的，tagstr指的是最后的输入内容，用于多选时的最后输入内容的查找对应的选项
                if (tagstr != "") {//如果不为空，因为如果刚选完，这个变量是空
                    $(this.$sele).next().find("ul").empty();
                    this.setBoxforAsso("checkbox", this.oldOptions, this.newOptions, tagstr, this.$box);
                }
                else{
                    $(this.$sele).next().find("ul").empty();
                    this.setBoxforAsso("checkbox", this.oldOptions, this.newOptions, "", this.$box);
                }
            });
            //为cs-select添加事件监听（点击就显示下拉菜单、输入改变时修正菜单内容）
            this.$sele.addEventListener('click', (e)=>{//同样的是点击显示框的事件，用于下拉框的显示与隐藏
                e.preventDefault();
                //设置this.$sele的高度，这样可以防撑开
                this.shadowRoot.querySelector(".cs-select")

                this.$sele.style.height = ''+this.$sele.offsetHeight + 'px';

                // //↓调整下拉框位置
                // var tdOffsetTop = $(this).parent()[0].offsetTop + layoutHeight;
                // var scrollTop = parent.document.getElementById('iframeContrainer').scrollTop;
                // tdOffsetTop -= scrollTop;
                // // 判断是否在上半区域
                // if (tdOffsetTop  > (windowHeight/2 + 60)) {// 如果需要移动
                //     // 将下拉菜单的top修改为：=原来值-下拉框高度 + 其父td的位置offsettop 
                //     $(this.$box)[0].style.top = Number($(this.$box)[0].offsetTop - 183 + $(this).parent()[0].offsetTop) + 'px';
                // }

                let pthis = $(e.target);//这个变量是下拉组件的显示框元素
                this.oldOptions = [];

                this.chooseGetMethod((obj)=>{//获取数据并执行后续操作，联想输入的单选和多选由于数据一般较多，不在初始化时获取，而是在此处获取
                    let tagstr = $(this.$sele).find("#input").html();
                    //调用插入数据函数
                    this.setBoxforAsso("checkbox", obj.oldOptions, obj.newOptions, tagstr, obj.$box);//这里根据上面的tagstr设置下拉框中的内容
                    if($(this).find("cs-select").length < 1 && $(this.$sele).attr('show-select') == 'true'){
                        $(this.$sele).attr('show-select', 'false');
                        $(this.$sele).next().hide();
                        return;
                    } else if($(this).find("cs-select").length < 1){
                        $(this.$sele).attr('show-select', 'false');
                        $(this.$sele).attr('show-select', 'true');
                        $(this.$sele).next().show();
                        //将光标移动到input中
                        $(this.$sele).find("#input").blur();
                        $(this.$sele).find("#input").focus();
                    }
                    //失焦逻辑
                    top.window.$(document).click(pthis,(event)=>{
                        if(($(this).find("cs-select").length == 0) && (event.target !== $(this)[0]) && ((event.target.shadowRoot === null) 
                        || $(event.target.shadowRoot).children().find(".cs-select")[0] !== pthis[0])){
                            $(this.$sele).attr('show-select', 'false');
                            $(this.$sele).next().hide();
                            $(this.$sele).find("#input").html("");
                        }
                    });
                });
            });

        }
        else if(this.cho == "radio" && this.isAsso === "true"){//为联想单选框
            //由于后续会对下拉数据做处理，且不能删除原来的oldOptions列表，故维持一个新的数组用于联想的下拉
            this.newOptions = this.oldOptions;//这个数组最开始应该等于oldOptions

            this.$sele = content.querySelector(".cs-select");//获得显示框
            //为显示框添加cho属性
            this.$sele.setAttribute("cho", this.cho);
            this.$sele.setAttribute("name", this.name);
            this.$sele.setAttribute("canInsert", this.getAttribute("canInsert") !== null?this.getAttribute("canInsert"):"false");

            // 下面这个添加placeholder对于联想的单多选是不生效的，不过在更换内部文本框为div后还未修改为可用格式
            //为cs-select内的input检查有无添加placeholder文本（有则预显示，无则不显示预加载文本）
            // if(this.getAttribute("placeholder") !== ""){
            //     $(this.$sele).find("input").attr("placeholder", this.getAttribute("placeholder"));
            // }

            //为cs-select添加内部的文本框并设置样式
            var input = $("<div tabindex='0' id='input' style='outline: none;;border: 0;text-align:left;vertical-align:middle;width:2px' contenteditable='true'></div>");
            $(this.$sele).append(input);
            $(this.$sele).css({
                'cursor': 'text'
            });

            this.$box = content.querySelector(".cs-select-box");//获得下拉菜单
            shadow.appendChild(content);
            //调整下拉菜单最大高度
            $(this.$box).css({
                'max-height': '300px',
                'background-color': 'white',
                'overflow-y': 'scroll',
                'z-index': '91'
            });
            //输入文本时调用展示下拉菜单函数
            $(this.$sele).find("#input").on('input propertychange', ()=>{
                var pthis = $(this.$sele).find("#input");
                if (pthis.html() != "") {
                    this.setBoxforAsso("radio", this.oldOptions, this.newOptions, pthis.html(), this.$box);
                }
                else{
                    this.setBoxforAsso("radio", this.oldOptions, this.newOptions, "", this.$box);
                }
            });

            //为cs-select添加事件监听（点击就显示下拉菜单、输入改变时修正菜单内容）
            this.$sele.addEventListener('click', (e)=>{
                e.preventDefault();

                //设置this.$sele的高度，这样可以防撑开
                this.shadowRoot.querySelector(".cs-select")
                this.$sele.style.height = ''+this.$sele.offsetHeight + 'px';

                // var tdOffsetTop = $(this).parent()[0].offsetTop + layoutHeight;
                // var scrollTop = parent.document.getElementById('iframeContrainer').scrollTop;
                // tdOffsetTop -= scrollTop;
                // // 判断是否在上半区域
                // if (tdOffsetTop  > (windowHeight/2 + 60)) {// 如果需要移动
                //     // 将下拉菜单的top修改为：=原来值-下拉框高度 + 其父td的位置offsettop 
                //     $(this.$box)[0].style.top = Number($(this.$box)[0].offsetTop - 182 + $(this).parent()[0].offsetTop) + 'px';                    
                // }

                let pthis = $(e.target);
                this.oldOptions = [];
                
                this.chooseGetMethod((obj)=>{
                    let tagstr = $(this.$sele).find("#input")?"":$(this.$sele).find("#input").html();
                    //调用插入数据函数
                    this.setBoxforAsso("radio", obj.oldOptions, obj.newOptions, tagstr, obj.$box);
                    if($(this).find("cs-select").length < 1 && $(this.$sele).attr('show-select') == 'true'){
                        $(this.$sele).attr('show-select', 'false');
                        $(this.$sele).next().hide();
                        return;
                    } else if($(this).find("cs-select").length < 1){
                        $(this.$sele).attr('show-select', 'false');
                        $(this.$sele).attr('show-select', 'true');
                        $(this.$sele).next().show();
                        //将光标移动到input中
                        $(this.$sele).find("#input").blur();
                        $(this.$sele).find("#input").focus();
                    }
                    var flag = true;
                    //失焦逻辑
                    top.window.$(document).click([pthis, flag],(event)=>{
                        if(($(this).find("cs-select").length == 0) && (event.target !== $(this)[0]) && ((event.target.shadowRoot === null) 
                        || $(event.target.shadowRoot).children().find(".cs-select")[0] !== pthis[0])){
                            $(this.$sele).attr('show-select', 'false');
                            $(this.$sele).next().hide();
                            $(this.$sele).find("#input").html("");
                            //判定若输入的数据不在已知库数据中(列表首项和输入文本不符合)，发送事件用于外部确认是否添加新数据
                            if(($(this.$sele)[0].getAttribute("canInsert") === "true"&& $(this.$sele).find("#input").html() !== "" && 
                            (($(this.$sele).next().find("li").length === 0) ||
                            ($(this.$sele).find("#input").html() !== $(this.$sele).next().find("li")?.[0].innerHTML))) && 
                            (flag)){
                                var changeEvent = new Event("without", {"bubbles":true, "composed":true});
                                $(this.$sele)[0].dispatchEvent(changeEvent);
                                flag=false;
                            }
                        }
                    });
                });
            });
        }
    }

    chooseGetMethod(callback){
        let a = new Promise((resolve, reject)=>{
            // 此时为每次点击框都会请求一次数据，后续可以更改
            if(this.url === "" && this.getDataByLS === "false" && this.getDataBySQLlite === "false") {// 此处判断是其他三种方法都不适用，说明是从标签获取
                this.getOptions(this.oldOptions);
                resolve(this);
            }
            else if(this.url !== "" && this.getDataByLS === "false" && this.getDataBySQLlite === "false"){// 此处判断说明是走网络请求的
                this.type = this.getAttribute("type");// 定义即将执行的网络请求是走get还是post
                if(this.type === "get"){
                    this.getOptionsByURL(this.url, this.type, this.mapping, "", this.extroFlour, (obj)=>{
                        resolve(obj);
                    });
                }
                else if(this.type === "post"){//如果是post方法，传递的data是隐式，就从postdata这个属性传进去
                    this.getOptionsByURL(this.url, this.type, this.mapping, this.getAttribute("postdata"), this.extroFlour, (obj)=>{
                        resolve(obj);
                    });
                }

            }
            else if(this.getDataByLS === "true"){//走sessionStorage获取数据
                // 注：sessionStorage添加了事件监听，当sessionStorage发生变化时会去重新获取一次数据，并加入对应的下拉框
                this.nameforLS = this.getAttribute("nameforLS");// 这里指明从sessionStorage的哪个字段获取数据，当然，session中存放的是可以转成json的字符串
                if(window.sessionStorage.getItem(this.nameforLS) !== null){//只有这个属性不为空时才走获取数据的函数，避免报错
                    this.getOptionBySessionStorage(this.oldOptions, window.sessionStorage, this.nameforLS, this.mapping);             
                }
                top.window.addEventListener('setItemEvent', event => {//这个就是session发生变化的事件监听
                    if(event.key === this.nameforLS){
                        this.getOptionBySessionStorage(this.oldOptions, window.sessionStorage, this.nameforLS, this.mapping);
                    }
                });
                resolve(this);
            }
            else if(this.getDataBySQLlite === "true"){//这里是说明走SQLite去获取数据
                this.SQLliteKey = this.getAttribute("SQLliteKey");// 从SQLite的哪个字段获取数据
                this.getOptionBySQLlite(this.SQLliteKey, this.mapping, ()=>{
                    resolve(this);
                });
            }
        });
        a.then((obj)=>{
            callback(obj);
        });
    }

    /** 下面的getOptions、getOptionsByURL、getOptionBySessionStorage、getOptionBySQLlite是四种数据请求的方法对应的函数
     * getOptions                   通过普通的<option>标签
     * getOptionsByURL              通过网络请求
     * getOptionBySessionStorage    通过sessionStorage
     * getOptionBySQLlite           通过SQLite(有拼写错误)
    */
    getOptions(oldOptions) {//从option标签获取选项,重新加入到oldOptions里
        var options = this.querySelectorAll("option");// 当然，每个option标签需要有文本和value字段
        for(var i = 0; i < options.length; i++){
            var tmp = new Object();
            let value = options[i].value;
            let name = options[i].innerHTML;
            tmp.value = value;
            tmp.name = name;
            oldOptions.push(tmp);
        }

    }

    getOptionsByURL(url, type, mapping, postdata, extroFlour, callback) {//从对应的top.getDataByTag函数获取选项,重新加入到oldOptions及box里
        var urlpath = url;//后端给的接口
        var data;
        if(type === "get"){//发送请求的方式为get
            $.ajax({
                url:  top.rootIp + '/' + urlpath,
                type: type,
                data: {},
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-access-tokens", `${top.loginToken}`);
                },
                success:  (res)=> {
                    if(res.success == false){}
                    else if(res.success != undefined){
                        if(extroFlour != null){
                            data = res['data'][extroFlour];
                        }
                        else{//如果没有额外层，就直接从data字段拿数据
                            data = res['data'];
                        }
                        var nametag = mapping['name'];
                        var idtag = mapping['id'];
                        if((Number(idtag)-0).toString() !== 'NaN'){// 这里是一个重要的判定
                            /** 上面的idtag是在组件的mapping属性中指定的id映射，
                             * 如果idtag是一个数字，代表从几开始编号下拉框中的选项，如0就是从0开始编号
                            */
                            var shouldAdd = (Number(idtag)-0);
                            if(nametag !== 'valueOfI'){
                                // 这个是=为了适应不同的json结构
                                /** 如果data是存在id和name的{}，那就直接获取即可，
                                 * 但如果data只有name属性，并不存在映射（即它是一个数组，就将nametag值设置为valueOfI，代表通过i去获取数据
                                 * 即name的值就是数组中第i个数据对应下方522行的if
                                 */
                                for (let i = 0; i < data.length; i++) {
                                    this.oldOptions.push({
                                        'name' : data[i][nametag],
                                        'value' : i + shouldAdd
                                    });
                                }
                            }
                            else if(nametag === 'valueOfI'){//三种从外部获取数据的函数都添加了这两种关于id和name的逻辑，下面不再重复叙述
                                for (let i = 0; i < data.length; i++) {
                                    this.oldOptions.push({
                                        'name' : data[i],
                                        'value' : i + shouldAdd
                                    });
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < data.length; i++) {
                                this.oldOptions.push({
                                    'name' : data[i][nametag],
                                    'value' : data[i][idtag]
                                });
                            }
                        }
                    }
                    callback(this);
                },
                error: function (e) {
                    if(obj.error != undefined){
                        obj.error(e);
                    }
                    top.console.log('network_error',e);
                }
            });            
        }
        else if(type === "post"){
            $.ajax({
                url:  top.rootIp + '/' + urlpath,
                type: type,
                data: JSON.stringify(JSON.parse(postdata)),
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-access-tokens", `${top.loginToken}`);
                },
                success:  (res)=> {
                    if(res.success == false){}
                    else if(res.success != undefined){
                        if(extroFlour != null){
                            data = res['data'][extroFlour];
                        }
                        else{
                            data = res['data'];
                        }
                        var nametag = mapping['name'];
                        var idtag = mapping['id'];
                        if((Number(idtag)-0).toString() !== 'NaN'){
                            var shouldAdd = (Number(idtag)-0);
                            if(nametag !== 'valueOfI'){
                                for (let i = 0; i < data.length; i++) {
                                    this.oldOptions.push({
                                        'name' : data[i][nametag],
                                        'value' : i + shouldAdd
                                    });
                                }
                            }
                            else if(nametag === 'valueOfI'){
                                for (let i = 0; i < data.length; i++) {
                                    this.oldOptions.push({
                                        'name' : data[i],
                                        'value' : i + shouldAdd
                                    });
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < data.length; i++) {
                                this.oldOptions.push({
                                    'name' : data[i][nametag],
                                    'value' : data[i][idtag]
                                });
                            }
                        }
                    }
                    callback(this);
                },
                error: function (e) {
                    if(obj.error != undefined){
                        obj.error(e);
                    }
                    top.console.log('network_error',e);
                }
            });   
        }
    }

    getOptionBySessionStorage(oldOptions, sessionStorage, nameforLS, mapping){// 走sessionStorage
        var data;
        var nametag = mapping['name'];
        var idtag = mapping['id'];
        var stringdata = sessionStorage.getItem(nameforLS);
        data = JSON.parse(stringdata);
        if((Number(idtag)-0).toString() !== 'NaN'){
            var shouldAdd = (Number(idtag)-0);
            if(nametag !== 'valueOfI'){
                for (let i = 0; i < data.length; i++) {
                    oldOptions.push({
                        'name' : data[i][nametag],
                        'value' : i + shouldAdd
                    });
                }
            }
            else if(nametag === 'valueOfI'){
                for (let i = 0; i < data.length; i++) {
                    oldOptions.push({
                        'name' : data[i],
                        'value' : i + shouldAdd
                    });
                }
            }
        }
        else {
            for (let i = 0; i < data.length; i++) {
                oldOptions.push({
                    'name' : data[i][nametag],
                    'value' : data[i][idtag]
                });
            }
        }
    }

    getOptionBySQLlite(SQLliteKey, mapping, callback) {//走SQLite
        //should attention 依赖于top.selectOfflineServerData的实现（从本地数据库SQLlite获取数据）
        let key_name = SQLliteKey;
        let pthis = this;
        //dataList处理方式
        top.selectOfflineServerData(key_name, (dataArray) => {
            // 注：此处存于离线数据库的内容data也应该是一个可以转为json的字符串，当然不是也可能不会报错，但不能获取到正确的数据
            var dataList = eval(dataArray[0]['data']);
            var nametag = mapping['name'];
            var idtag = mapping['id'];
            if((Number(idtag)-0).toString() !== 'NaN'){
                var shouldAdd = (Number(idtag)-0);
                if(nametag !== 'valueOfI'){
                    for (let i = 0; i < dataList.length; i++) {
                        pthis.oldOptions.push({
                            'name' : dataList[i][nametag],
                            'value' : i + shouldAdd
                        });
                    }
                }
                else if(nametag === 'valueOfI'){
                    for (let i = 0; i < dataList.length; i++) {
                        pthis.oldOptions.push({
                            'name' : dataList[i],
                            'value' : i + shouldAdd
                        });
                    }
                }
            }
            else {
                for (let i = 0; i < dataList.length; i++) {
                    pthis.oldOptions.push({
                        'name' : dataList[i][nametag],
                        'value' : dataList[i][idtag]
                    });
                }
            }
            callback();
        });
        return;
    }

    /** 这下面的setBoxforCheckbox、setBoxforRadio、setBoxforAsso是在获取到数据存于数组后设置下拉框中选项的方法
     * setBoxforCheckbox    为普通多选框设置下拉框
     * setBoxforRadio       为普通单选框设置下拉框
     * setBoxforAsso        为联想输入设置下拉框（只是一个判断，具体的实现是这个函数下面的两个show函数（因为涉及产生一个newOptoions数组
    */
    setBoxforCheckbox(content, oldOptions){//将获取好的内容设置到下拉菜单div中
        if(content.querySelector(".cs-select-box")!==null && $(content.querySelector(".cs-select-box")).find("div").length == 0){
            // 上面这个判断是当且仅当下拉框元素已经正常产生，并内部内容为空时才执行下面的代码
            content.querySelector(".cs-select-box").innerHTML="";//首先清空，避免重复加入
            for(var i=0; i<oldOptions.length; i++){//循环加入
                var oneDiv = document.createElement("div");
                oneDiv.setAttribute("style", "text-align: left;width:100%");
                oneDiv.innerHTML = "<input type='checkbox' value='" + oldOptions[i]['value'] + "' name='checkbox' id='checkbox_" +
                    i + "'/><span>" + oldOptions[i]['name'] + "</span>";
                content.querySelector(".cs-select-box").appendChild(oneDiv);
                // 因为是多选，所以这上面的这个循环中是为下拉添加了一个div元素
            }
            
            var divList = $(content.querySelector("div.cs-select-box")).find("div");//获取上面加入的所有选项div
            for(var i = 0; i < divList.length; i++){//为每个div绑定事件
                var pthis = this;
                divList.eq(i).click(pthis, function(e){
                    var $this = $(this);
                    var $sele = $this.parent();//找到cs-select-box
                    $sele.prev().empty();// 置空 以免同一选项重复加入
                    $sele.prev().attr("idNum", "");// idNum是对应选项的value，用于后端处理数据的
                    for(let j = 0; j < divList.length; j++) {
                        if(divList.eq(j).find('input').prop('checked') && $sele.prev().html().length == 0){
                            $sele.prev().attr("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                            $sele.prev().append('' + divList.eq(j).find('span').html() + '');
                            $sele.prev().attr("idNum", divList.eq(j).find("input").val());
                            $(e.data).attr("idNum", divList.eq(j).find("input").val());
                        }
                        else if(divList.eq(j).find('input').prop('checked')){
                            $sele.prev().attr("style", "border: 0px;width: 100%;height: 100%;text-align: left;");
                            $sele.prev().append("；" + divList.eq(j).find('span').html() + '');
                            $sele.prev().attr("idNum", $sele.prev().attr("idNum") + "_" + divList.eq(j).find("input").val());
                            $(e.data).attr("idNum", $sele.prev().attr("idNum"));
                        } 
                    }
                    $sele.prev().attr("title", $sele.prev().html());// 同步设置title提示内容（用于当内容过长，隐藏后可以鼠标悬浮查看全部内容
                });
            }
        }
    }
    setBoxforRadio(content, oldOptions){// 为普通单选框设置下拉
        if(content.querySelector(".cs-select-box")!==null){
            content.querySelector(".cs-select-box").innerHTML = "";//首先清空，避免重复加入
            for(var i = 0; i<oldOptions.length; i++){
                var oneDiv = document.createElement("div");
                oneDiv.setAttribute("style", "float: left;width: 100%;");
                oneDiv.innerHTML = "<input type='radio' value='" + oldOptions[i]['value'] + "' name='radio' id='radio_" +
                    i + "'/><span onclick=''>" + oldOptions[i]['name'] + "</span>";
                content.querySelector(".cs-select-box").appendChild(oneDiv);
            }
            var oneDiv = document.createElement("div");
            oneDiv.setAttribute("style", "float: left;width: 100%;background-color:#dbdbdb");
            oneDiv.innerHTML = "<input type='radio' value='-1' name='radio' id='radio_-1'/><span>清空</span>";
            content.querySelector(".cs-select-box").appendChild(oneDiv);        
            //为每个div绑定事件
            var divList = $(content.querySelector("div.cs-select-box")).find("div");
            var pthis = this;
            for(var i = 0; i < divList.length-1; i++){
                divList.eq(i).click(function(){
                    $(this).find("input").attr("checked",true);
                    $(this).parent().prev().attr("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                    $(this).parent().prev().html($(this).find("span").html());
                    $(this).parent().prev().attr("title", $(this).parent().prev().html());
                    $(this).parent().prev().attr('show-select', 'false');
                    $(this).parent().hide();
                    pthis.setAttribute("idNum", $(this).find("input").val());
                    pthis.shadowRoot.querySelector(".cs-select").setAttribute("idNum", $(this).find("input").val());
                });
            }
            divList.eq(divList.length-1).click(function(){// 这一段是最底下的一个选项，用于单选框清空已选内容
                $(this).find("input").attr("checked",true);// 首先将这个无用选项选中（因为是单选，程序会自动取消选中原来的选项
                $(this).find("input").attr("checked",false);// 再将这个“清空”无用选项取消选中，达成清空的目的
                $(this).parent().prev().attr("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                $(this).parent().prev().html("");
                $(this).parent().prev().attr("title", "");// 同步清空提示内容
                $(this).parent().prev().attr('show-select', 'false');
                $(this).parent().hide();
                pthis.setAttribute("idNum", "");// 同步清空对应的已选id
                pthis.shadowRoot.querySelector(".cs-select").setAttribute("idNum", "");// 同步清空对应的已选id
            });
        }
    }

    //判断输入的函数    
    setBoxforAsso(str, oldOptions, newOptions, tag, box){//判断是联想单选还是联想多选
        if(str === "radio"){
            this.showBoxAndsetRadio(oldOptions, newOptions, tag, box);
        }
        else if(str === "checkbox"){
            this.showBoxAndsetCheckbox(oldOptions, newOptions, tag, box);
        }
    }

    // 为联想单选下拉根据已输入的内容设置下拉框
    showBoxAndsetRadio(oldOptions, newOptions, tag, box){
        newOptions = [];// 这个变量是存放联想结果的数组
        let ulObj = $('<ul style="list-style: none;overflow-y:auto;padding:0;"></ul>');
        let tagStr = tag;
        // 优化循环处理，但需要唯一标识才可用
        // if (tagStr.length === 0) {
        //     let optionConf = sessionStorage.getItem('optionConf')
        //     if (optionConf) {
        //         optionConf = JSON.parse(optionConf)
        //     }
        //     console.log(optionConf)
        //     if (optionConf && optionConf.type === top.working.sheetType) {
        //         newOptions = optionConf.options
        //     } else {
        //         for (let i = 0; i < oldOptions.length; i++) {
        //             newOptions.push({
        //                 name: oldOptions[i],
        //                 num: 0
        //             })
        //         }
        //         optionConf = JSON.stringify({type: top.working.sheetType, options: newOptions})
        //         optionConf = sessionStorage.setItem('optionConf', optionConf)
        //     }
        // } else {
        //     for (let i = 0; i < oldOptions.length; i++) {
        //         let num = 0;
        //         for (let k = 0; k < tagStr.length; k++) {
        //             if (oldOptions[i].name.toLowerCase().indexOf(tagStr[k].toLowerCase()) >= 0) {
        //                 num++;
        //             }
        //         }
        //         if(num > 0) {
        //             let item = {
        //                 name: oldOptions[i],
        //                 num: num
        //             };
        //             newOptions.push(item);   
        //         }   
        //     }
        // }

        //列表显示逻辑（匹配度越高的越靠前显示）
        for (let i = 0; i < oldOptions.length; i++) {
            if(tagStr.length !== 0){
                let num = 0;
                for (let k = 0; k < tagStr.length; k++) {
                    if (oldOptions[i].name.toLowerCase().indexOf(tagStr[k].toLowerCase()) >= 0) {
                        num++;// 这里是匹配每个字是否相等，此处先不加入选项，仅记录num作为匹配度
                    }
                }
                if(num > 0) {//如果num > 0说明存在一定程度的匹配
                    let item = {
                        name: oldOptions[i],
                        num: num
                    };
                    newOptions.push(item);// 为new选项数组加入数据
                }   
            }
            else {// 这个else是当联想的文本为空时（如第一次点击显示框、刚选完一个选项时
                let item = {
                    name: oldOptions[i],
                    num: 0
                };
                newOptions.push(item); 
            }
        }
        
        newOptions.sort(function (a, b) {// 使用sort按照匹配度将option数组排序
            return b.num - a.num;
        });
        //↑列表显示逻辑

        if (newOptions.length > 0) {// 由于已经排过序，那么匹配度从高到低依次加入列表就行
            for (let i = 0; i < newOptions.length; i++) {
                ulObj.append("<li id='" + newOptions[i].name.value +"' style='padding: 0 3px;"
                +"cursor: pointer;border-top: 0.5px solid #d5d5d5;font-size:14px;text-align:center;white-space: pre-line;width: 9.5em'>" 
                + newOptions[i].name.name + "</li>");
            }
        }
        //设置下拉菜单
        ulObj.css('width', '9.5em');
        $(box).css('width', '10.5em');
        $(box).empty().append(ulObj);// 先置空下拉框后加入，避免重复加入
        //为列表中元素加入事件
        var liList = $(box).find("li");
        for(var j = 0; j < liList.length; j++) {
            liList.eq(j).click((e)=>{// 点击某一选项
                //将选中的选项变为span加入显示框
                let oneSpan = $("<div class='neirong' id='" + $(e.target).attr('id')
                + "' contenteditable='false' style='white-space:nowrap;height:auto;width:auto;cursor:pointer;'>" 
                + $(e.target).html() + "</div>");
                //为这个span加入事件
                oneSpan.on("mouseenter", (e)=>{
                    oneSpan.css({
                        "border": "1px solid #000",
                        "padding-top":"1px",
                        "z-index":"99",
                        "font-size":"8pt"
                    });
                    let X = $("<div id='cancel' style='color:#000;display:inline-block;position:relative;right:0%;font-size:10.5pt;z-index:9'>×</div>");
                    oneSpan.append(X);
                    oneSpan.on('click', ()=>{
                        oneSpan.remove();
                        $(box).prev().attr("title", "");
                        $(box).prev().attr("idNum", "");
                        $(this).attr("idNum", "");
                        $(this.$sele).find("#input").blur();
                        $(this.$sele).find("#input").focus();
                    });
                });
                oneSpan.on("mouseleave", (e)=>{
                    oneSpan.css({
                        "border": "0px",
                        "color":"#000",
                        "z-index":"default",
                        "font-size":"10.5pt"
                    });
                    oneSpan.unbind("click");
                    oneSpan.find("#cancel").remove();
                });
                $(box).prev().find(".neirong").remove();
                $(box).prev().prepend(oneSpan);
                $(box).prev().find("#input").html("");
                $(box).prev().attr("title", $(e.target).html());
                $(box).prev().attr("idNum", $(e.target).attr('id'));
                $(this).attr("idNum", $(e.target).attr('id'));
                //自动隐藏下拉框
                $(e.target).parent().parent().prev().attr('show-select', 'false');
                $(e.target).parent().parent().hide();
                var changeEvent = new Event('change');//定义change事件
                this.dispatchEvent(changeEvent);// 发出change事件
                // 注：上面的这个事件主要用于需要外部其他td根据联想下拉所选择的内容自动关联填入用的，外部页面可以监听到组件发出了这个change事件
            });
        }
    }
    showBoxAndsetCheckbox(oldOptions, newOptions, tag, box){// 为联想多选加入数据
        let excludeOptions = $(box).prev().children(".neirong");
        let idList = [];
        // 上面这个变量是为了在加载下拉框时将已经选中的选项从下拉中移除用的，它是一个数组
        let excludeString = this.checkboxSetNewOptions(oldOptions, newOptions, tag, box, excludeOptions);
        //为列表中元素加入事件
        var liList = $(box).find("li");
        for(var j = 0; j < liList.length; j++) {
            liList.eq(j).click((e)=>{
                //下面这注释掉的两行是自动隐藏逻辑，多选不用，所以注掉了
                // $(e.target).parent().parent().prev().attr('show-select', 'false');
                // $(e.target).parent().parent().hide();

                //将选中的选项变为span加入显示框
                let oneSpan = $("<div class='neirong' id='" + $(e.target).attr('id') 
                + "' contenteditable='false' style='white-space:nowrap;height:auto;width:auto;cursor:pointer;'>" 
                + $(e.target).html() + "</div>");
                //为这个span加入事件
                oneSpan.on("mouseenter", (e)=>{
                    oneSpan.css({
                        "border": "1px solid #000",
                        "padding-top":"1px",
                        "z-index":"99",
                        "font-size":"8pt"
                    });
                    let X = $("<div id='cancel' style='color:#000;display:inline-block;position:relative;right:0%;font-size:10.5pt;z-index:9'>×</div>");
                    oneSpan.append(X);
                    oneSpan.on('click', ()=>{
                        if(!oneSpan.prev()[0]){
                            oneSpan.next(".fenge").remove();
                            oneSpan.remove();
                        }
                        else {
                            oneSpan.prev(".fenge").remove();
                            oneSpan.remove();
                        }
                        //修改excludeString、excludeOptions、title、idNum
                        excludeOptions = $(box).prev().children(".neirong");
                        idList = [];
                        let excludeList = [];
                        for(let i = 0; i < excludeOptions.length; i++){
                            excludeList.push(excludeOptions.eq(i).html());
                            idList.push(excludeOptions.eq(i).attr("id"));
                        }
                        excludeString = excludeList.join("、");
                        $(box).prev().attr("title", excludeString);
                        $(box).prev().attr("idNum", idList.join('_'));
                        $(this).attr("idNum", idList.join('_'));
                    });
                });
                oneSpan.on("mouseleave", (e)=>{
                    oneSpan.css({
                        "border": "0px",
                        "color":"#000",
                        "z-index":"default",
                        "font-size":"10.5pt"
                    });
                    oneSpan.unbind("click");
                    oneSpan.find("#cancel").remove();
                });
                if($(box).prev().children(".neirong").length === 0){
                    $(box).prev().prepend(oneSpan);
                }
                else {
                    $(box).prev().children(".neirong").eq($(box).prev().children(".neirong").length - 1).after(oneSpan);
                    let fengefu = $("<div class='fenge'>、</div>");
                    $(box).prev().children(".neirong").eq($(box).prev().children(".neirong").length - 2).after(fengefu);
                }

                //修改excludeString、excludeOptions、tag、title、idNum
                excludeString += ("、" + $(e.target).html());
                excludeOptions = $(box).prev().children(".neirong");
                tag = "";
                $(box).prev().attr("title", excludeString);
                idList = [];
                for(let i = 0; i < excludeOptions.length; i++){
                    idList.push(excludeOptions.eq(i).attr("id"));
                }
                $(box).prev().attr("idNum", idList.join('_'));
                $(this).attr("idNum", idList.join('_'));
                //清空input内容
                $(e.target).parent().parent().prev().find("#input").html("");

                //将鼠标焦点设置回input 从而实现连续输入
                $(this.$sele).find("#input").blur();
                $(this.$sele).find("#input").focus();
                // 同样的会发出一个change事件
                var changeEvent = new Event('change');
                this.dispatchEvent(changeEvent);

                $(e.target).remove();// 这一行的作用是在选中选项后将这个选项从下拉中移除，减轻重复获取数据的压力
            });
        }
    }
    checkboxSetNewOptions(oldOptions, newOptions, tag, box, excludeOptions){
        let excludeList = [];
        for(let i = 0; i < excludeOptions.length; i++){
            excludeList.push(excludeOptions.eq(i).html());
        }
        let tmp = 0;
        newOptions = [];
        let ulObj = $('<ul style="list-style: none;overflow-y:auto;padding:0;"></ul>');
        let tagStr = tag;
        //列表显示逻辑（匹配度越高的越靠前显示）
        for (let i = 0; i < oldOptions.length; i++) {
            if(oldOptions[i].name === excludeList[tmp]){
                tmp++;
                continue;
            }
            else if(tagStr.length !== 0){
                let num = 0;
                for (let k = 0; k < tagStr.length; k++) {
                    if (oldOptions[i].name.toLowerCase().indexOf(tagStr[k].toLowerCase()) >= 0) {
                        num++;
                    }
                }
                if(num > 0) {
                    let item = {
                        name: oldOptions[i],
                        num: num
                    };
                    newOptions.push(item);   
                }   
            }
            else {
                let item = {
                    name: oldOptions[i],
                    num: 0
                };
                newOptions.push(item); 
            }
        }
        
        newOptions.sort(function (a, b) {
            return b.num - a.num;
        });
        //↑列表显示逻辑
        
        if (newOptions.length > 0) {
            for (let i = 0; i < newOptions.length; i++) {
                ulObj.append("<li id='" + newOptions[i].name.value +"' style='padding: 0 3px;"
                +"cursor: pointer;border-top: 0.5px solid #d5d5d5;font-size:14px;text-align:center;white-space: pre-line;width: 9.5em'>" 
                + newOptions[i].name.name + "</li>");
            }
        }
        //设置下拉菜单
        ulObj.css('width', '9.5em');
        $(box).css('width', '10.5em');
        $(box).empty().append(ulObj);
        return excludeList.join("、");
    }

    //get value 和set value
    set value(str){
        //防止出现unfinded的情况
        if(str==undefined){
            str=''
        }
        var strList = str.split(/[,,;,；, ,_,、]/);
        if(this.getAttribute("isAsso") === "false"){
            // 上面这个判断是指的当待设置数据的下拉组件为普通单选和普通多选时
            if(this.getAttribute("cho") == "radio"){
                this.oldOptions = [];
                this.chooseGetMethod((obj)=>{
                    //调用插入数据函数
                    this.oldOptions = obj.oldOptions;
                    this.setBoxforRadio(this.shadowRoot, obj.oldOptions);
                    var optionList = this.shadowRoot.querySelector("#root > div.cs-select-box").querySelectorAll("div");
                    this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = "";
                    for(var i = 0; i < optionList.length; i++){
                        optionList[i].querySelector("input").checked = false;//先取消选中
                        if(strList[0] === optionList[i].querySelector("span").innerHTML){// 如果传入的是要选中选项的字符串
                            optionList[i].querySelector("input").checked = true;//选中选项
                            this.setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            this.shadowRoot.querySelector(".cs-select").setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            //为上方显示框加入字符串
                            this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                            this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = strList[0];
                            break;
                        }
                        else if(strList[0] === optionList[i].querySelector("input").value){// 如果传入的是要选中选项的id
                            optionList[i].querySelector("input").checked = true;//选中选项
                            this.setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            this.shadowRoot.querySelector(".cs-select").setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            //为上方显示框加入字符串
                            this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                            this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = optionList[i].querySelector("span").innerHTML;
                            break;
                        }
                    }
                    this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("title", this.shadowRoot.querySelector("#root > div.cs-select").innerHTML);        
                });
            }
            else if(this.getAttribute("cho") == "checkbox"){
                this.oldOptions = [];
                this.chooseGetMethod((obj)=>{     
                    //调用插入数据函数
                    this.oldOptions = obj.oldOptions;
                    this.setBoxforCheckbox(this.shadowRoot, obj.oldOptions);
                    var optionList = this.shadowRoot.querySelector("#root > div.cs-select-box").querySelectorAll("div");
                    var j = 0;
                    this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = "";
                    for(var i = 0; i < optionList.length; i++){
                        optionList[i].querySelector("input").checked = false;//先取消选中
                        if(strList[j] === optionList[i].querySelector("span").innerHTML){// 如果传入的是要选中选项的字符串
                            optionList[i].querySelector("input").checked = true;//选中选项
                            this.setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            //为上方显示框加入字符串
                            if(j != 0 && strList.length > 1){
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML += ("；" + strList[j]);
                            }
                            else if(strList.length === 1){
                                this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = strList[j];
                            }
                            else{
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = strList[j];
                            }
                            j++;
                        }
                        else if(strList[j] === optionList[i].querySelector("input").value){// 如果传入的是要选中选项的id
                            optionList[i].querySelector("input").checked = true;//选中选项
                            //为上方显示框加入字符串
                            if(j != 0 && strList.length > 1){
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML += ("；" + optionList[i].querySelector("span").innerHTML);
                                this.setAttribute("idNum", this.getAttribute("idNum") + "_" + optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            }
                            else if(strList.length === 1){
                                this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("style", "border: 0px;width: 100%;height: 100%;text-align: center;");
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = optionList[i].querySelector("span").innerHTML;
                                this.setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            }
                            else{
                                this.shadowRoot.querySelector("#root > div.cs-select").innerHTML = optionList[i].querySelector("span").innerHTML;
                                this.setAttribute("idNum", optionList[i].querySelector("input").value);// 同步设置idNum属性值
                            }
                            j++;
                        }
                    }
                    this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("title", this.shadowRoot.querySelector("#root > div.cs-select").innerHTML);
                });
            }
        }
        else if(this.getAttribute("isAsso") === "true" && this.getAttribute("cho") == "radio"){
            let idList = $(this).attr("idNum");
            let temp = $("<div id='" + idList + "' class='neirong' contenteditable='false' style='white-space:nowrap;height:auto;width:auto;cursor:pointer;'>"
            + strList[0] + "</div>");//将每个待加入选项做成div
            //为temp绑定事件
            //为这个span加入事件
            temp.on("mouseenter", (e)=>{//鼠标移入时添加点击删除的事件
                temp.css({
                    "border": "1px solid #000",
                    "padding-top":"1px",
                    "z-index":"99",
                    "font-size":"8pt"
                });
                let X = $("<div id='cancel' style='color:#000;display:inline-block;position:relative;right:0%;font-size:10.5pt;z-index:9'>×</div>");
                temp.append(X);
                temp.on('click', ()=>{
                    temp.remove();
                    $(this.shadowRoot.querySelector("#root > div.cs-select")).attr("title", "");
                    $(this.shadowRoot.querySelector("#root > div.cs-select")).attr("idNum", "");
                    $(this).attr("idNum", "");
                    $(this.shadowRoot.querySelector("#root > div.cs-select")).find("#input").blur();
                    $(this.shadowRoot.querySelector("#root > div.cs-select")).find("#input").focus();
                });
            });
            temp.on("mouseleave", (e)=>{
                temp.css({
                    "border": "0px",
                    "color":"#000",
                    "z-index":"default",
                    "font-size":"10.5pt"
                });
                temp.unbind("click");
                temp.find("#cancel").remove();
            });
            $(this.shadowRoot.querySelector("#root > div.cs-select")).find(".neirong").remove();
            $(this.shadowRoot.querySelector("#root > div.cs-select")).prepend(temp);
            this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("title", temp.html());
        }
        else if(this.getAttribute("isAsso") === "true" && this.getAttribute("cho") == "checkbox"){
            $(this.shadowRoot.querySelector("#root > div.cs-select")).children(".neirong").remove();
            $(this.shadowRoot.querySelector("#root > div.cs-select")).children(".fenge").remove();
            let excludeString = "";
            if(strList[0] === ""){
                strList = [];
            }
            let idList = $(this).attr("idNum").split("_");
            for(var i = 0; i < strList.length; i++){
                let temp = $("<div id='" + idList[i] + "' class='neirong' contenteditable='false' style='white-space:nowrap;height:auto;width:auto;cursor:pointer;'>"
                    + strList[i] + "</div>");
                //为temp绑定事件
                //为这个span加入事件
                temp.on("mouseenter", (e)=>{
                    temp.css({
                        "border": "1px solid #000",
                        "padding-top":"1px",
                        "z-index":"99",
                        "font-size":"8pt"
                    });
                    let X = $("<div id='cancel' style='color:#000;display:inline-block;position:relative;right:0%;font-size:10.5pt;z-index:9'>×</div>");
                    temp.append(X);
                    temp.on('click', ()=>{
                        if(!temp.prev()[0]){
                            temp.next(".fenge").remove();
                            temp.remove();
                        }
                        else {
                            temp.prev(".fenge").remove();
                            temp.remove();
                        }
                        //修改excludeString、excludeOptions、title、idNum
                        let excludeOptions = $(this.shadowRoot.querySelector("#root > div.cs-select")).children(".neirong");
                        idList = [];
                        let excludeList = [];
                        for(let i = 0; i < excludeOptions.length; i++){
                            excludeList.push(excludeOptions.eq(i).html());
                            idList.push(excludeOptions.eq(i).attr("id"));
                        }
                        let excludeString = excludeList.join("、");
                        $(this.shadowRoot.querySelector("#root > div.cs-select")).attr("title", excludeString);
                        $(this.shadowRoot.querySelector("#root > div.cs-select")).attr("idNum", idList.join('_'));
                        $(this).attr("idNum", idList.join('_'));
                    });
                });
                temp.on("mouseleave", (e)=>{
                    temp.css({
                        "border": "0px",
                        "color":"#000",
                        "z-index":"default",
                        "font-size":"10.5pt"
                    });
                    temp.unbind("click");
                    temp.find("#cancel").remove();
                });
                excludeString += ("、" + strList[i]);
                if(i === 0){
                    $(this.shadowRoot.querySelector("#root > div.cs-select")).prepend(temp);
                }
                else{
                    $(this.shadowRoot.querySelector("#root > div.cs-select > .neirong")).eq($(this.shadowRoot.querySelector("#root > div.cs-select > .neirong")).length - 1).after(temp);
                    let fengefu = $("<div class='fenge'>、</div>");
                    $(this.shadowRoot.querySelector("#root > div.cs-select > .neirong")).eq($(this.shadowRoot.querySelector("#root > div.cs-select > .neirong")).length - 2).after(fengefu);
                }
            }
            this.shadowRoot.querySelector("#root > div.cs-select").setAttribute("title", excludeString);
        }
    }
    get value(){
        var str="";
        if(this.getAttribute("isAsso") === "false"){
            var optionList = this.shadowRoot.querySelector("#root > div.cs-select-box").querySelectorAll("div");
            for(var i=0; i<optionList.length; i++){
                if(optionList[i].querySelector("input").checked) str += (optionList[i].querySelector("span").innerHTML + " ");
            }
            return str;
        }
        else if(this.getAttribute("isAsso") === "true" && this.getAttribute("cho") == "radio"){
            let spanList = $(this.shadowRoot.querySelector("#root > div.cs-select")).find(".neirong");
            str = spanList.html();
            return str;
        }
        else if(this.getAttribute("isAsso") === "true" && this.getAttribute("cho") == "checkbox"){
            let spanList = $(this.shadowRoot.querySelector("#root > div.cs-select")).children(".neirong");
            str = spanList.eq(0).html();
            for(let i = 1; i < spanList.length; i++){
                str += (" " + spanList.eq(i).html()); 
            }
            return str;
        }
    }
    get urlpath() {
        return this.getAttribute('url');
    }
    set urlpath(value) {
        this.setAttribute('url', value);
    }
    get idNum() {
        return this.getAttribute('idNum');
    }
    set idNum(value) {
        this.setAttribute('idNum', value);
    }
    get counts() {//这个和下面那个set所涉及的这个counts属性，是用于设置一个数值来判断<cs-select></cs-select>中的<option>个数变化，当增加或减少时更新内部下拉框
        return this.getAttribute('counts');
    }
    set counts(value) {
        this.setAttribute('counts', value);
    }
    static get observedAttributes() {// 观察属性变化，用于当外部js修改属性值时更新下拉数据
        return ['url', 'idNum', 'counts'];
    }
    attributeChangedCallback(name, oldVal, newVal) {
        if(name === 'url') {
            this.url=newVal;            
        }
        if(name === 'idNum') {
            this.idNum=newVal;
        }
        if(name === 'counts') {
            this.oldOptions = [];
            this.getOptions(this.oldOptions);
        }
    }
}
window.customElements.define('cs-select', Select);