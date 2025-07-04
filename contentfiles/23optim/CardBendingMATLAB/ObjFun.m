function Obj = ObjFun(X)
%define objective function. X(1) is a, X(2) is b

noNodes = 100;
b = ones(1,noNodes); % initialise b

nodeLocations = linspace(0,0.297 - 0.025,100);

for i = 1:length(nodeLocations)

    if nodeLocations(i) < X(1)
        b(i) = 0.21;
    else
        b(i) = 2.*halfwidth(X(1),X(2),nodeLocations(i)) + 0.01;

    end
end



Obj = beamBending(b);

end
