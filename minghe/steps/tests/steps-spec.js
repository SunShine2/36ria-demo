describe('KISSY.Steps',function(){
    var S = KISSY, DOM = S.DOM,color='red',steps,
        HTMLSteps = DOM.create('<ol id="steps-demo"><li>1. ����µ�</li><li>2. ��Ҹ���</li> <li>3. ����</li> <li>4. ���ȷ���ջ�</li> <li>5. ����</li> </ol>');
    beforeEach(function(){
        DOM.append(HTMLSteps,'body');
        steps = new KISSY.Steps(HTMLSteps);
        steps.render();
    });
    afterEach(function() {
       DOM.remove(HTMLSteps);
    });
    it('KISSY.Steps�Ѿ�����',function(){
        expect(steps.isRender).toEqual(true);
    });
    describe('�����',function(){
         var act = 2,act2 = '',currentCls = KISSY.Steps.cls.CURRENT,hasCurCls;
         it('ȷ������Ϊ���ڵ���0������',function(){
              expect(act).toBeGreaterThan(-1);
         });
         it('�ɹ������',function(){
             steps.set('act',act);
             expect(steps.get('act')).toEqual(act);
         });
        /*
         it('ȷ���ü�������õ�ǰ��ʽ',function(){
             //alert(DOM.html(steps.steps[act-1]));
             hasCurCls = DOM.hasClass(s.teps.steps[act-1],currentCls);
             //alert(DOM.attr(steps.steps[act-1],'class'));
             expect(hasCurCls).toEqual(true);
        });
        */
        it('������Ϊ����ֵ��С��0ʱ������Ϊ0',function(){
             steps.set('act',act2);
             expect(steps.get('act')).toEqual(0);
         });
    });
    describe('��������ɫ',function(){
         var color = 'red',isAllowColor = false;
         it('ȷ������ɫΪ������õ���ɫ',function(){
             isAllowColor = steps.isAllowColor(color);
             expect(isAllowColor).toEqual(true);
         });
         it('�ɹ�������ɫ',function(){
            steps.set('color',color);
            expect(steps.get('color')).toEqual(color);
         })
    });
    describe('��������',function(){
        var widthEmpty = -100,widthNumber = 200,itemWidth;
        it('widthΪ����ֵ�ͻ�С��0��ƽ�ֲ�����',function(){
            itemWidth = steps.itemWidth;
            steps.set('width',widthEmpty);
            expect(steps.get('width')).toEqual(itemWidth);
        });
        it('�Զ��嵥������',function(){
            steps.set('width',widthNumber);
            expect(steps.get('width')).toEqual(widthNumber);
        })
    });

});