namespace TaskManager.Common;
public interface IDeepCloneable<out T> { 
    T Clone();
}

