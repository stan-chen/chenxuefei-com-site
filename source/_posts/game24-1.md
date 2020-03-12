---
title: 关于24点算法(一)
date: 2017-10-20 08:36:30
categories:
  - C++
tags: 
    - Game24
    - Algorithm
keywords: "算法, 24点"
---

24点游戏算是一个比较经典的算法了，基本只能靠穷举法算出所有可能性，然后进行判断，我的基本思路如下：  
指定的输入序列是一个multi无序数组，包含需要计算的数字，输出是一个四则运算表达式，仔细研究这个表达式，其实这个表达式就是一个树状实现，比如一个最简单的`3*(6+(6/3))`和一个`(3+6)*(3+6)`所形成的树状形式：  
{% ossimg tree.png 表达式树状实现 %}

上图形成的树状形式有以下几个特点：  
1. 形成的树状形式是一棵完全二叉树
2. 叶子节点始终是待求取的数字个数
3. 操作符节点个数(n-1)，叶节点个数(n)

这样就将括号问题转化为**树的子节点问题**，解决加法和乘法的等同性就转化为了**加法节点左右两棵子树交换顺序也同为一个表达式**，整个求取表达式的问题就转化成了**在一个数字集合中，可以组合出多少种满足上述条件的树**，综合一下，问题就变成了：  
> 对一个个数为N的数字集合中取C(N,2)，组合出一个节点，然后放入原集合(此时原集合个数变成N-1)，然后再从现集合中重复上述步骤，直到集合中的节点数变为1，即为最终结果，当出现最终结果的时候，该节点即是一棵表达式树的根节点。  

直接上代码:  
```C++
#include <set>
#include <vector>
#include <algorithm>
#include <iostream>
#include <sstream>

//基本操作符枚举
enum class Operator {
    NONE,
    ADD,
    DEC,
    MUL,
    SUB
};
//重载输出基本操作符运算符
std::ostream & operator << (std::ostream & out, const enum class Operator op) {
    switch (op) {
    case Operator::ADD:
        out << "+"; break;
    case Operator::DEC:
        out << "-"; break;
    case Operator::MUL:
        out << "*"; break;
    case Operator::SUB:
        out << "/"; break;
    }
    return out;
}
//结果节点
struct ResultNode {
    ResultNode(int val) :result(val) {}
    int result;
    Operator   calc_operator{ Operator::NONE };
    const ResultNode * left{ nullptr };
    const ResultNode * right{ nullptr };

    ResultNode(const ResultNode &rh) {
        result = rh.result;
        calc_operator = rh.calc_operator;
        left = rh.left;
        right = rh.right;
    }
    ResultNode & operator = (const ResultNode& rh) {
        result = rh.result;
        calc_operator = rh.calc_operator;
        left = rh.left;
        right = rh.right;
        return *this;
    }

    bool operator < (const ResultNode &rh) const
    {
        return result < rh.result;
    }

    bool isSingle() const {
        return left == nullptr && right == nullptr;
    }
};

//打印出一棵节点树
void PrintResult(std::ostream &out, const ResultNode & result) {
    if (result.left == nullptr) {
        out << result.result;
        return;
    }
    if (!result.left->isSingle())out << "(";
    PrintResult(out, *result.left);
    if (!result.left->isSingle())out << ")";
    out << result.calc_operator;
    if (!result.right->isSingle())out << "(";
    PrintResult(out, *result.right);
    if (!result.right->isSingle())out << ")";
}

//组合类实现，实现从一个结果集中取出N个的可能性 C(S,N)
template<typename T, unsigned long N = 2>
class combination {
public:
    explicit combination(const std::vector<T> &val) : value(val) {
        //std::sort(value.begin(), value.end());
        auto size = value.size();//std::unique(value.begin(), value.end()) - value.begin();
        bitsets.assign(size, 0);
        if (size >= N) {
            for (int i = 0; i < N; ++i) {
                bitsets[i] = 1;
            }
            initflag = true;
        }
    }

    void    get_value(std::vector<T> & in, std::vector<T> & other) {
        for (auto i = 0; i < bitsets.size(); ++i) {
            if (bitsets[i] == 1) {
                in.push_back(value[i]);
            }
            else {
                other.push_back(value[i]);
            }
        }
        for (auto v = value.begin() + bitsets.size(); v != value.end(); ++v) {
            other.push_back(*v);
        }
    }

    //取出下一个可能的结果,如果没有结果了就返回false
    bool    next(std::vector<T> & out, std::vector<T> & other) {
        if (bitsets.size() < N) {
            return false;
        }
        if (initflag) {
            get_value(out, other);
            initflag = false;
        }
        else {
            auto f = std::prev_permutation(bitsets.begin(), bitsets.end());
            if (f) get_value(out, other);
            return f;
        }
        return true;
    }

    bool                initflag;
    std::vector<char>   bitsets;
    std::vector<T>      value;
};

//最终结果集
std::set<std::string> ResultSet; 

//计算主要递归函数
int CalcEx(const std::vector<ResultNode> &set, const int result) {
    if (set.size() == 1) {
        if (result == set[0].result) {
            std::stringstream ss;
            PrintResult(ss, set[0]);
            //std::cout << std::endl;
            ResultSet.insert(ss.str());//这里可以有效避免重复
        }
        return 0;
    }

    combination<ResultNode> source{ set };
    std::vector<ResultNode> next, other;
    //不断的从结果集中取组合，然后组合成新的结果集，再次调用递归
    while (source.next(next, other)) {
        //ADD
        {
            auto _next = next;
            auto _other = other;
            ResultNode r(_next[0].result + _next[1].result);
            r.left = &_next[0];
            r.right = &_next[1];
            r.calc_operator = Operator::ADD;
            _other.push_back(r);
            CalcEx(_other, result);
        }
        //DEC first-second
        {
            auto _next = next;
            auto _other = other;
            ResultNode r(_next[0].result - _next[1].result);
            r.left = &_next[0];
            r.right = &_next[1];
            r.calc_operator = Operator::DEC;
            _other.push_back(r);
            CalcEx(_other, result);
        }
        //DEC second-first
        {
            auto _next = next;
            auto _other = other;
            ResultNode r(_next[1].result - _next[0].result);
            r.left = &_next[1];
            r.right = &_next[0];
            r.calc_operator = Operator::DEC;
            _other.push_back(r);
            CalcEx(_other, result);
        }
        //MUL
        {
            auto _next = next;
            auto _other = other;
            ResultNode r(_next[0].result * _next[1].result);
            r.left = &_next[0];
            r.right = &_next[1];
            r.calc_operator = Operator::MUL;
            _other.push_back(r);
            CalcEx(_other, result);
        }
        //SUB first/second
        {
            auto _next = next;
            auto _other = other;
            if (_next[1].result == 0 || (_next[0].result % _next[1].result) != 0)
                goto NEXTSUB;
            ResultNode r(_next[0].result / _next[1].result);
            r.left = &_next[0];
            r.right = &_next[1];
            r.calc_operator = Operator::SUB;
            _other.push_back(r);
            CalcEx(_other, result);
        }
    NEXTSUB:
        //SUB second/first
        {
            auto _next = next;
            auto _other = other;

            if (_next[0].result == 0 || (_next[1].result % _next[0].result) != 0)
                goto CONTINUE;
            ResultNode r(_next[1].result / _next[0].result);
            r.left = &_next[1];
            r.right = &_next[0];
            r.calc_operator = Operator::SUB;
            _other.push_back(r);
            CalcEx(_other, result);
        }
    CONTINUE:
        next.clear();
        other.clear();
        continue;
    }
    return 0;

}


TEST(Game24Test, TowValue) {
    //计算2个值的情况
    {
        std::vector<ResultNode> v;
        v.push_back(12); v.push_back(12);
        CalcEx(v, 24);
        //输出 12+12
        for (auto & result : ResultSet) {
            std::cout << result << std::endl;
        }
    }
}

TEST(Game24Test, Unsolvable) {
    ResultSet.clear();
    //计算无解的情况
    {
        std::vector<ResultNode> v;
        v.push_back(3); v.push_back(2); v.push_back(3); v.push_back(4);
        CalcEx(v, 24);
        //无输出
        for (auto & result : ResultSet) {
            std::cout << result << std::endl;
        }
    }
}

int main() {
    
    std::vector<ResultNode> v;
    v.push_back(3); v.push_back(3); v.push_back(6); v.push_back(6);
    CalcEx(v, 24);
    //无输出
    for (auto & result : ResultSet) {
        std::cout << result << std::endl;
    }

    return 0;
}
```
这个算法版本有以下几点问题： 
1. 无法完全去重，因为输入极限情况(比如输入相同的数字)，还是会有重复。
2. 实现的效率不高，因为频繁拷贝复制操作，导致效率底下。
3. 拓展性不强，只能是数字形式，可以采用模板改写为通用形式(只要能实现四则运算的对象)。

